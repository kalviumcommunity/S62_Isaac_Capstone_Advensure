**Project Idea: AdvenSure – The Travel planner of the future**

**Problem Statement:-**
People often face problems while planning their trips. In my project I aim to bring a solution for the same. In my website the people can add the type of vehicle they intend to travel and if it is their personal vehicle the Mileage the vehicle provides their budget for the whole trip and other aspects. With the details provided by the user, I can show them results based on their requirements.

**Technical analysis:-**
- **Mongo DB:-**
Storing the user data once they sign up which will be used to verify when they login to the page
Storing the the user’s travel history
- **Express/Node.js:-**
Authentication and authorization when the user is signing in and logging in
Fetching data from the hotel api
Handling the server side logic and api calls
- **React:-**
React will be used for creating the frontend
Tailwindcss will be used for Styling
- **Other tools:-**
Google maps api will be used for geolocation services
Makcorps hotel api will be used for obtaining up-to-date accommodation information

**Must-Do (Core Features)**
- **User Inputs:**
- **Starting Point:** Automatically fetch or allow manual input of the user’s current location.
- **Visiting Area(optional):** Input fields for multiple destinations/areas to visit.
- **Budget:** Allow the user to specify their total trip budget.
- **Duration:** Input for the trip period (start date and end date).
- **Number of People:** Field for entering the group size.
- **Vehicle Details:** 
- - Dropdown or selection for the mode of transportation.
- - Input for mileage if a personal vehicle is selected.
- - Distance and Fuel Cost Calculation:
- - Use mapping APIs like Google Maps or Mapbox to calculate distances between destinations.
- - Calculate fuel costs based on distance, mileage, and current fuel prices.
- - **Budget Analysis:**
Provide a breakdown of expenses like fuel, accommodations, food, and activities based on user input and average costs.
**Itinerary Generator:**
Suggest an optimized route based on the visiting areas.
Provide an itinerary with estimated travel times and stopovers.
**Should-Do (Important Enhancements)**
- - **Recommendations:**
Suggest accommodations, restaurants, and attractions based on the user’s visiting area and budget.
Use APIs like Makcorps hotel for recommendations.
- - **User Accounts:**
Allow users to create accounts and save multiple trip plans.
**Could-Do (Nice-to-Have Features)**
- **Vehicle Database:**
Provide mileage data for common vehicle types to assist users who don’t know their vehicle’s mileage.
- **Weather Forecast Integration:**
Display weather forecasts for the planned destinations during the trip duration.
- **Save & Share Plans:**
Let users save their trip plans and revisit them later.
Allow sharing trip plans with friends or family.
- **AI Integration:**
In the future we can integrate ai into the same making it much more efficient
**Development Phases:-**
- **(Week 1-2):-**
Creating the low fidelity and high fidelity prototype
Creating the frontend pages
- **(Week 3):-**
Setting up the backend server and installing the necessary packages
setting up the necessary endpoint and making api calls
Authentication of the user
- **(Week 4-5)**
Making api calls to the Makcorps hotel api
Deploying the frontend and backend
- **(Week 6-8)**
Testing the application
Debugging the application for smooth user experience
