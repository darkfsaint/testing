import smtplib #IMPORT email smtp mlibrary
from email.mime.text import MIMEText #import library that handles email content
#email content html format
html_content = """

"""

msg = MIMEText(html_content, 'html')  #formats content
msg['Subject'] = "Royal Mail Redelivery Notice"#create email subject
msg['From'] = "EMAIL"#make ur from the same as the email ur using to sendout
msg['To'] = "Destination email"#use a different email to receive the mail
try:
    with smtplib.SMTP("smtp.gmail.com", 587) as server:#connects to mail servers (gmail)
        server.starttls()#starts tls connection
        server.login("EMAIL", "APP PASSWORD")#logins using app credentials
        server.send_message(msg) #sends formatted message with from to and subject
except Exception as e:   #errors are recorded
    print('Error sending email:', str(e)) 
