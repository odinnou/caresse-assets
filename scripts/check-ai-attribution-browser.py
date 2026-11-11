import json
import mimetypes
from pathlib import Path
import shutil
from urllib.parse import unquote, urlparse
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
dist=(root/'dist').resolve()
routes=json.loads((root/'src/data/routes.json').read_text())
profiles=[
 ('desktop',{'viewport':{'width':1440,'height':1000}}),
 ('iphone',{'viewport':{'width':390,'height':844},'is_mobile':True,'has_touch':True,'user_agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'}),
 ('android',{'viewport':{'width':360,'height':800},'is_mobile':True,'has_touch':True,'user_agent':'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36'}),
]
sources=[('fr','perplexity.ai','perplexity'),('en','chatgpt.com','chatgpt'),('es','claude.ai','claude'),('pt','gemini.google.com','gemini'),('de','copilot.microsoft.com','copilot')]
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox'])
 for profile,settings in profiles:
  for locale,host,provider,family in [(locale,host,provider,family) for locale,host,provider in sources for family in ['home','demo','couples','couples-game']]:
   context=browser.new_context(service_workers='block',**settings)
   context.add_init_script("window.geoEvents=[]; window.umami={track:(name,data)=>window.geoEvents.push({name,...data})};")
   def intercept(route):
    url=urlparse(route.request.url)
    if url.hostname=='caresse.app':
     path=(dist/unquote(url.path).lstrip('/')).resolve()
     if not path.is_relative_to(dist):return route.abort()
     if url.path.endswith('/'):path=path/'index.html'
     if path.is_file():return route.fulfill(path=str(path),content_type=mimetypes.guess_type(str(path))[0] or 'application/octet-stream')
     return route.fulfill(status=404,body='Local fixture missing')
    if url.hostname in ['apps.apple.com','play.google.com']:
     return route.fulfill(status=200,content_type='text/plain',body='Store intercepted locally')
    return route.abort()
   context.route('**/*',intercept)
   tab=context.new_page();errors=[]
   tab.on('pageerror',lambda error:errors.append(str(error)))
   path=routes[family][locale]['path']
   tab.goto('https://caresse.app'+path,referer=f'https://{host}/private-conversation?prompt=secret',wait_until='networkidle')
   assert not tab.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth'),(locale,profile,'overflow')
   navigate=profile!='desktop' and family in ['couples','couples-game']
   if navigate:
    target=routes['how-it-works'][locale]['path']
    tab.locator(f'a[href="{target}"]:visible').first.click()
    tab.wait_for_url('https://caresse.app'+target)
    tab.wait_for_load_state('networkidle')
   assert not errors,(locale,profile,errors)
   expected='play.google.com' if profile=='android' else 'apps.apple.com'
   selector='#hero-store-cta' if family=='demo' else '#hero-cta'
   with context.expect_page() as opened:tab.locator(selector).click()
   popup=opened.value;popup.wait_for_url('https://'+expected+'/**');popup.close()
   events=tab.evaluate('window.geoEvents.filter(e=>e.name==="store_click")')
   assert len(events)==1,(locale,profile,events)
   event=events[0]
   assert event['ai_provider']==provider,(locale,profile,event)
   assert event['acquisition_channel']=='ai',event
   assert event['acquisition_referrer_host']==host,event
   assert event['landing_page']==path,event
   assert event['first_store_click'] is True,event
   assert event['first_link_click']==(not navigate),event
   assert 'secret' not in json.dumps(event) and 'private-conversation' not in json.dumps(event),event
   results.append({'locale':locale,'family':family,'profile':profile,'provider':provider,'ok':True})
   context.close()
 browser.close()
(root/'artifacts/geo').mkdir(parents=True,exist_ok=True)
(root/'artifacts/geo/ai-attribution-browser.json').write_text(json.dumps(results,indent=2)+'\n')
print(f'{len(results)} AI referral/store journeys passed on desktop, iPhone and Android; all site resources and store navigations served locally.')
