class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def green(text: str) -> str:
    return f"{Colors.GREEN}{text}{Colors.ENDC}"

def red(text: str) -> str:
    return f"{Colors.RED}{text}{Colors.ENDC}"

def yellow(text: str) -> str:
    return f"{Colors.YELLOW}{text}{Colors.ENDC}"

def blue(text: str) -> str:
    return f"{Colors.BLUE}{text}{Colors.ENDC}"