# Pages
- Welcome page
- Log in with register button
- Register (Create Account)
- Main default page (after logged in)
- Edit profile (includes preferences)	
- Matches

# Test Cases
## Register page
- All fields except for prefreance age are mandatory
- Duplicate email will display error
## Login page
- Email and password are validated
## Main (swipe) page
- User photo and name appears at the top
- Match name, age and photo appears on the page
- Unlike and Like buttons will display next match
- Unlike and Like buttons will display Unlike and Like texts and delay next match by half a second
- Logout button will return back to welcome page
## Edit profile page
- Will display user current profile settings and filtering
- Will allow change and update
- Cancel button will return back to main screen and cancel changes
- Update button will display updated user name and photo if changed and save user details
- Update will return back to Main page
- Delete Account will delete user session and account details from the database and return user to a Welcome page
- Interests will display all the available choices and highlight user chosen choices
	- Cancel button will return back to profile page
	- Update will save user chosen interests and return back to profile page
## Match page
- Will display matches that both parties have liked
- Will display match name, age and photo
- Unmatch button will remove the match for both parties. The suggestion in the swipe will no longer appear for both parties
- Close button will return back to main page
