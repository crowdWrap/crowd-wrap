# Live: https://crowdwrap.works/
# crowd-wrap

Gift giving is a wonderful way to show appreciation, celebrate milestones, and strengthen relationships. However, it can be a time-consuming and stressful process, especially when trying to find the perfect gift for someone. To address this problem, we are developing a web app that streamlines the process of gift giving.

The web app will provide a user-friendly interface that guides users through the entire gift-giving process, from selecting the recipient to purchasing and delivering the gift. Users will start by creating a profile, which includes information about their gift preferences, budget, and occasions they typically celebrate.

### Technology Stack:

- **Frontend:**
  - React
  - Framer Motion
  - ChakraUI
  - WebSockets
  - Paypal API
- **Backend:**
  - Postgresql
  - Prisma
  - Express
  - Passport
  - Socket
- **Additional Tools:**
  - AWS EC2
  - AWS E3 Storage
  - Sendgrid

### Main Features

#### Landing page 
- Simple landing page where users are able to understand what the application is for
- ![Screenshot 2024-01-08 at 4 44 04 PM](https://github.com/crowdWrap/crowd-wrap/assets/39009375/4681e2fe-d698-4761-8f26-952a185a9bc2)

#### Auth, Sessions, & User Managment 
- Allow users to Login/Signup with Email/Username and Google Oauth with a seamless experience.
- Users sessions expire after 7 days
- Easy forgot password option
- Protected Routes
- ![Screenshot 2024-01-08 at 4 47 10 PM](https://github.com/crowdWrap/crowd-wrap/assets/39009375/9a6c72b8-7b98-49b6-834a-f97e126ff595)

#### Friends 
- Interactive friends list, where users send friend requests based on username, and accept/deny.
- Can see requests sent, and requests received
- Can check friends online/offline status
- Search through friendslist
- ![Screenshot 2024-01-08 at 4 50 09 PM](https://github.com/crowdWrap/crowd-wrap/assets/39009375/b470df8a-9833-4303-941a-3bac05b39053)

#### Events 📝
- Easily create events and add friends
- Can add friends from friendslist to events
- Delete events
- Goto inner event
- Create invite links to the event for people not signed up/added as a friend
- Check progress on goal, description, and deadline
- ![Screenshot 2024-01-08 at 4 53 29 PM](https://github.com/crowdWrap/crowd-wrap/assets/39009375/2db957be-ecb6-46a0-bd59-e157fb5e50ed)

#### Inner Events 📝
- Live Chat with and discuss options with friends
- Add/Remove(Only if owner of event) friends while inside event
- Change event name, description, and goal
- Share invite link
- Gift List accessible by all users
- Check how much each user paid towards goal
- Pay towards the goal via Paypal (Only if pay option is enabled in the owners settings)
- ![Screenshot 2024-01-08 at 4 56 58 PM](https://github.com/crowdWrap/crowd-wrap/assets/39009375/ede287c0-f99b-49f7-bf79-6727a3a22c9e)

#### Settings 📝
- Change email & password if account was created with email 
- Change username
- Enable payment and change payment email
- ![Screenshot 2024-01-08 at 4 59 58 PM](https://github.com/crowdWrap/crowd-wrap/assets/39009375/a199ce14-e0aa-45b0-b622-9a4b9d685bd4)

