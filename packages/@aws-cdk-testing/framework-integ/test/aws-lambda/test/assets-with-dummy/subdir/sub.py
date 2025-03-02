def get_message():
    with open("subdir/message.txt", "r") as file:
        return file.read().strip()
