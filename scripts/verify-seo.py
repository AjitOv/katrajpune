"""Verify server-rendered discovery of every approved profile and key SEO contracts."""
import concurrent.futures, html, json, re, sys, urllib.request, xml.etree.ElementTree as ET
base = sys.argv[1] if len(sys.argv)>1 else 'http://localhost:3095'
def fetch(path):
 with urllib.request.urlopen(base+path, timeout=60) as r:
  assert r.status==200,(path,r.status)
  return r.read().decode()
sitemap=ET.fromstring(fetch('/sitemap.xml'))
urls=[n.text for n in sitemap.findall('.//{*}loc')]
assert len(urls)==len(set(urls)), 'Duplicate sitemap URLs'
profiles={u.removeprefix('https://katrajpune.com') for u in urls if '/business/' in u}
first=fetch('/browse')
pages={html.unescape(u) for u in re.findall(r'href="(/browse\?page=\d+)"', first)}
seen=set()
for body in [first]+list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch,sorted(pages))):
 seen.update(re.findall(r'href="(/business/[^"?]+)"',body))
 for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',body):json.loads(raw)
assert seen==profiles, {'unreachable':sorted(profiles-seen),'missing_from_sitemap':sorted(seen-profiles)}
for path in ['/browse?page=2','/category/restaurants?page=2','/locality/katraj-chowk?page=2','/add-business','/deals']:
 body=fetch(path)
 assert f'href="https://katrajpune.com{path.replace("&","&amp;")}"' in body,('canonical',path)
 assert re.search(r'rel="canonical"',body)
home=fetch('/')
assert '<h1' in home and 'href="/browse"' in home
robots=fetch('/robots.txt')
assert 'OAI-SearchBot' in robots and 'Disallow: /api/admin' in robots
print(json.dumps({'base':base,'sitemap_urls':len(urls),'business_profiles':len(profiles),'browse_pages':len(pages)+1,'profiles_reachable_via_html_links':len(seen),'result':'PASS'},indent=2))
