# Minor Project
## Financial_Assistant

## Group - 18

**Mentor** - Prof. Sudesh Rani, Faculty, Computer Science and Engineering

### Developers:

- Vishal Thakur - 18103007
- Gaganpreet Singh Khurana - 18103032
- Shayan Yaseen - 18103033
- Akshit Garg - 18103042


## Project Execution:
&nbsp;&nbsp;&nbsp;<img src="https://github.com/GaganpreetKhurana/Financial_Assistant/blob/master/Execution/DONNA%20_1.gif" width="50%" height="45%"><br><br>

**AI ChatBot** <br><br>
&nbsp;&nbsp;&nbsp;<img src="https://github.com/GaganpreetKhurana/Financial_Assistant/blob/master/Execution/DONNA_2.gif" width="50%" height="45%"><br>

## Documentation:

[Summary](https://docs.google.com/document/d/e/2PACX-1vTOTM-U3jg__7pfAhukVKwP5QTQv3WoCXxfo-fjr5FjjX2IrqEN7Tc0SAIHljEXob_cXVm-KZLrUgwe/pub)

## Requirements
<ul>
<li><a href="https://www.python.org/downloads/release/python-379/">Python 3.7</a></li>
<li><a href="https://www.npmjs.com/get-npm">npm 6.14.7</a></li>
</ul>

## Run Instructions
<ol>
    <li>Clone the repository.</li>
    <li>Add the following files.<code>secret_key.py</code> at backend/backend/
        <pre>
            DJANGO_SECRET_KEY = 'r+k$)jbma$$c+o#fzt(^aoc+q8j6ztmh!n5l$$g0j&62hco*+)'
            SENDER_EMAIL = "Your GMAIL E-Mail ID"
            SENDER_EMAIL_PASSWORD = "YOUR GMAIL APP Password generated after enabling 2 factor auth in account settings"
            DJANGO_MAIL_HOST = 'smtp.gmail.com'
            DJANGO_MAIL_HOST_PORT = 587
        </pre>
    </li>
    <li>Run the backend, and the frontend server to start the project.
    <ul>
    <li><h3>Batch Scripts</h3>
    <ul>
        <li>
        <h2>Linux</h2>
            <ul>
            <li><b>SETUP</b>
                <ul>
                    <li> - Install python3-venv on Debian based distros run <code>sudo apt install python3-venv</code> </li>
                    <li> - Create python3-venv in the backend using <code>sudo python3 -m venv backend/venv</code></li>
                    <li> - Install espeak on Debian based distros run <code>sudo apt-get install espeak</code></li>
                    <li> - Run <code>make install</code> in bash shell to set up the environment and install necessary packages.</li>
                </ul>
            </li>
            <li><b>RUN</b>
                <ul>
                    <li>- Run <code>make</code> to start the servers. Wait for the browser to open.</li>
                </ul>
            </li>
            </ul>
        </li>
        <li>
        <h2>Windows</h2>
            <ul>
        <li>
            <b>SETUP</b>
            - Run <code>install_requirements.bat</code> to setup the environment and install necessary packages.</li>
        <li>
            <b>RUN</b> 
            - Run <code>donna.bat</code> to start the servers. Wait for the browser to open.</li>
            </ul>
        </li>
    </ul></li>
        <li><h3>Command Line </h3>
        Open 2 terminal windows/tabs.
        <ul>
            <li><h4>Backend</h4>
            <ol>
              <li>Give command <code> pip install -r requirements.txt</code> to install the required dependencies.</li>
              <li>Change directory to backend  <code>cd backend</code></li>
              <li>Give command <code>python manage.py runserver</code> to run the backend server. </li>
            </ol></li>
            <li><h4>Frontend</h4>
            <ol>
              <li>Change directory to frontend  <code>cd frontend</code></li>
              <li>Give command <code>npm install</code> to install the required dependencies.</li>
              <li>Give command <code>npm start</code> to run the frontend server and this will automatically start the app in the browser. </li>
            </ol></li>
        </ul></li>
    </ul></li>
</ol>   


## Objectives:

**Currently Functional**

- User can record their transactional activities
- Can set the amazon tracker to track a particular item and predict the best time to buy it. 
- Can manage their stock portfolio and get a prediction for a stock price/portfolio
- User can interact with the system using a traditional web form or use the chatbot
- Added multilingual interaction
- Visualization of user data
- Voice-based interaction through Text to speech

---

# Progress:

1 August 2020 - 16 August 2020

**Team formation and Mentor Selection:**

- Team Member Selection.
- Preliminary domain shortlisting
- Approaching the mentor with related domain specialization

---
15 August 2020 - 5 September 2020

**Project Discussion**

- Our Preliminary domain was shortlisted to a web and ml based project
- Among many other ideas, we decided to build an application which helps a user keep track of all their financial expenditures

---
5 September 2020 - 25 September 2020

**Framework Training and Initial Commits**

- We decided to use Django for the backend and React for the frontend
- An appropriate period was used to learn the new framework
- The project was divided into three modules trackers-chatbot, backend, and frontend 
- The three sub-modules were developed to provide basic features in this period
- Integration of the modules was absent in this period
- This allowed us to avoid errors in integration when the codebase was turbulent

---

25 September 2020 - 5 October 2020

**Module Integration**

- With basic features working in each module, we integrated the project in this period
- This included debugging the integration errors and standardizing the codebase
- Completed the login and authentication features
- Integrated the chatbot with the stock and amazon trackers
- Working Features - Transaction activities using web-form, Login Authentication Chat Bot, Stock, and Amazon Trackers

---
5 October 2020 - 15 October 2020

**Feature Expansion**

- Most of the basic features are working in this stage
- The chatbot, which was working standalone on the backend, was  now integrated with the frontend
- Issued several bugs fixes in the modules and integration

---
15 October 2020 - Present

**Feature Expansion**

- Added several features like Visualizations, Translations and text to speach
- Issued several bugs fixes

