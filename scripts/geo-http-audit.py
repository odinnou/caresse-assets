"""Public retrieval baseline; does not submit URLs or impersonate search crawlers."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import csv
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://caresse.app'
FAMILIES = ['home', 'couples', 'comparison', 'is-caresse-safe', 'how-it-works', 'tarifs', 'demo', 'couples-game', 'for-blind-and-low-vision']

class SameSiteRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        target = urllib.parse.urlparse(newurl)
        if target.scheme != 'https' or target.hostname not in ['caresse.app', 'www.caresse.app']:
            raise urllib.error.HTTPError(req.full_url, code, 'External redirect not followed', headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonical = []
        self.robots = []
        self.alternates = []
        self.lang = ''
        self.h1 = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang', '')
        if tag == 'h1': self.h1 += 1
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(a.get('href', ''))
        if tag == 'link' and a.get('rel') == 'alternate' and a.get('hreflang'): self.alternates.append(a['hreflang'])
        if tag == 'meta' and a.get('name', '').lower() in ['robots', 'googlebot', 'bingbot']:
            self.robots.append(a.get('content', ''))

def retrieve(path):
    row = {'checked_at_utc': datetime.now(timezone.utc).isoformat(), 'url': ORIGIN + path}
    try:
        request = urllib.request.Request(ORIGIN + path, headers={'User-Agent': 'Caresse-GEO-audit/1.0 (+https://caresse.app/)'})
        with urllib.request.build_opener(SameSiteRedirect()).open(request, timeout=20) as response:
            body = response.read(2_000_001)
            if len(body) > 2_000_000: raise ValueError('Response exceeds audit limit')
            row.update(http_status=response.status, final_url=response.url, content_type=response.headers.get('Content-Type', ''),
                       x_robots_tag=response.headers.get('X-Robots-Tag', ''), last_modified=response.headers.get('Last-Modified', ''),
                       bytes=len(body), sha256=hashlib.sha256(body).hexdigest(), error='')
        if path.endswith('/'):
            page = Page(); page.feed(body.decode('utf-8'))
            row.update(canonical='|'.join(page.canonical), canonical_ok=page.canonical == [ORIGIN + path],
                       meta_robots='|'.join(page.robots), locale=page.lang, h1=page.h1, alternate_count=len(page.alternates))
        else: row['kind'] = 'asset'
        local = ROOT / 'dist' / (path.lstrip('/') + ('index.html' if path.endswith('/') else ''))
        row['matches_local_build'] = body == local.read_bytes() if local.exists() else ''
        return row, body.decode('utf-8')
    except (OSError, ValueError, urllib.error.URLError) as error:
        row.update(http_status=getattr(error, 'code', ''), error=str(error))
        return row, ''

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', default='artifacts/geo/http-public.csv')
    args = parser.parse_args()
    routes = json.loads((ROOT / 'src/data/routes.json').read_text())
    paths = list(dict.fromkeys([routes[family][locale]['path'] for family in FAMILIES for locale in ['fr', 'en', 'es', 'pt', 'de']]))
    paths += ['/robots.txt', '/sitemap.xml', '/llms.txt']
    with ThreadPoolExecutor(max_workers=4) as executor: results = list(executor.map(retrieve, paths))
    documents = dict(zip(paths, (body for _, body in results)))
    sitemap = set()
    if documents['/sitemap.xml']:
        sitemap = {node.text for node in ET.fromstring(documents['/sitemap.xml']).findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
    robots = urllib.robotparser.RobotFileParser(); robots.parse(documents['/robots.txt'].splitlines())
    for path, (row, _) in zip(paths, results):
        if path.endswith('/'):
            row['in_sitemap'] = row['url'] in sitemap if sitemap else ''
            for bot in ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'Googlebot', 'bingbot']:
                row['robots_allows_' + bot] = robots.can_fetch(bot, row['url']) if documents['/robots.txt'] else ''
    fields = list(dict.fromkeys(key for row, _ in results for key in row))
    output = Path(args.out); output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('w', newline='') as file:
        writer = csv.DictWriter(file, fields, lineterminator='\n'); writer.writeheader(); writer.writerows(row for row, _ in results)
    issues = [row['url'] for row, _ in results if row.get('http_status') != 200 or row.get('error')]
    print(f'{len(results)} public HTTP requests; {len(issues)} retrieval issues. Output: {output}')
    print('HTTP access and robots permissions do not establish indexing or AI citations. No URLs submitted.')
    if issues: raise SystemExit(1)

if __name__ == '__main__': main()
