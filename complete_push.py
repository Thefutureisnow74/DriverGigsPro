#!/usr/bin/env python3
import subprocess
import time

def handle_db_push():
    process = subprocess.Popen(
        ['npx', 'drizzle-kit', 'push'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        cwd='/home/runner/workspace'
    )
    
    # Send "+" to accept table creation when prompted
    try:
        output, _ = process.communicate(input='+\n', timeout=30)
        print(output)
    except subprocess.TimeoutExpired:
        process.kill()
        print("Process timed out")
        
if __name__ == "__main__":
    handle_db_push()