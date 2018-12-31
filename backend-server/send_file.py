from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from requests_futures.sessions import FuturesSession

session = FuturesSession()

def requests_retry_session(
    retries=3,
    backoff_factor=1,
    status_forcelist=(500, 502, 504),
):
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def send_file(file_path):
    url = 'http://localhost:3500/upload'
    files = {'photo': open(file_path, 'rb')}

    requests_retry_session().post(url, files=files)
