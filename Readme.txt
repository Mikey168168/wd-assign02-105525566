===================================================
  README.txt – DineEasy Restaurant Platform
  Assignment 2 | Web Development | COS10005
  Swinburne University of Technology
  Semester 1, 2026
===================================================

---------------------------------------------------
STUDENT DETAILS
---------------------------------------------------
Student Name:   [Your Full Name Here]
Student ID:     [Your Student ID Here]

---------------------------------------------------
WEBSITE STRUCTURE
---------------------------------------------------
assignment2/
├── index.html          Home page — introduces the platform
├── restaurants.html    Lists all 6 partner restaurants
├── recommend.html      Recommendation form with JS logic
├── register.html       User registration form with JS validation
├── reservation.html    Reservation form with deposit & payment logic
├── bill.html           Bonus: Estimated bill calculator page
├── css/
│   └── style.css       Single external stylesheet for all pages
├── js/
│   └── script.js       Single JavaScript file for all pages
├── images/
│   ├── logo.png
│   ├── hero.jpg
│   └── restaurant1.jpg … restaurant6.jpg
└── Readme.txt          This file

---------------------------------------------------
GITHUB REPOSITORY
---------------------------------------------------
[Insert your GitHub repository link here]

---------------------------------------------------
JAVASCRIPT VALIDATION LOGIC (Plain English)
---------------------------------------------------

REGISTRATION FORM (register.html):

1. Username — The code checks the value entered is at least 5
   characters long and only contains letters, numbers, and
   underscores. It uses a regular expression for this check.

2. Email — The code checks the email contains an "@" symbol
   and a "." character, which is the basic format for an
   email address.

3. Phone — The code strips any non-digit characters and checks
   the result is between 8 and 15 digits long.

4. Password — The code checks the password is at least 10
   characters and includes at least one uppercase letter,
   one lowercase letter, one number, and one special character
   such as ! or @. This uses a regular expression.

5. Confirm Password — The code compares the confirm password
   field value to the password field value. If they are not
   identical, an error is shown.

6. Gender — The code checks whether any of the gender radio
   buttons are checked. If none are selected, an error shows.

7. Country — The code checks the dropdown is not left on the
   default empty option.

If any field fails, an error message appears below that field
and the form does NOT submit. Only when all fields pass does
the form submit.

---------------------------------------------------

RESERVATION FORM (reservation.html):

1. Full Name, Email, Phone — Standard checks: not empty,
   valid email format (contains @), at least 10 phone digits.

2. Restaurant — The dropdown must not be left on the default
   empty option.

3. Date and Time — The code creates a JavaScript Date object
   from the chosen value and compares it to the current date
   and time. If the chosen time is in the past, an error shows.

4. Number of People — The code checks the value is a number
   greater than 0.

5. Payment Method:
   - If Voucher is selected, the voucher code textbox is shown
     and the credit card section is hidden. No validation is
     done on the voucher code itself.
   - If Online Payment is selected, the credit card section
     is shown. The code checks the card number contains only
     digits and is either 15 digits (Amex) or 16 digits
     (Visa/Mastercard).

6. Billing Email — Validated the same way as the main email.
   If the "Same as email address" checkbox is ticked, the
   main email is automatically copied into the billing email
   field using JavaScript.

---------------------------------------------------

RECOMMENDATION LOGIC (recommend.html):

The recommendation system stores all restaurant data in a
JavaScript object. Each restaurant has three properties:
dietary tags, budget level, and an array of purposes.

When the user submits the form, the code loops through every
restaurant and checks three rules:
  Rule 1: If the user picked Vegan or Halal, the restaurant
          must support it.
  Rule 2: The restaurant's budget level must match the user's
          selection exactly.
  Rule 3: The restaurant's purpose array must include the
          user's chosen purpose.

Using an array for purposes (e.g. ["family", "casual"])
allows a single restaurant to appear in multiple categories,
which produces more useful results compared to a single
fixed value.

Only restaurants passing all three rules are shown. If no
restaurants match, a "no results" message is displayed.

---------------------------------------------------

BILL CALCULATOR (bill.html) — BONUS FEATURE:

The calculator stores a price range (low and high per person)
for each restaurant. When the user selects a restaurant and
enters a group size, the code multiplies the low and high
prices by the number of people to produce an estimated range.

If the user ticks "I have already paid the deposit", the
deposit amount for that restaurant is subtracted from both
the low and high estimates to show the remaining balance.

The result updates automatically every time the user changes
any input — no submit button is needed.

---------------------------------------------------
DYNAMIC FEATURES
---------------------------------------------------
- Deposit box: Updates automatically when the user selects
  a restaurant on the reservation page.
- Payment fields: Voucher/card fields appear or disappear
  based on the selected payment method.
- Billing email: Auto-fills when the "Same as email"
  checkbox is ticked.
- Pre-fill: If the user arrives from the restaurants page or
  recommendation page, the restaurant dropdown is
  automatically set using the URL query parameter.
- Bill calculator: Updates dynamically on every input change
  without requiring a form submission.

---------------------------------------------------
KNOWN ISSUES / LIMITATIONS
---------------------------------------------------
- The registration form has no back-end database as per the
  assignment requirements.
- The reservation form action uses a placeholder student ID
  (it000000) — this must be updated with your actual student
  ID before deploying to Mercury.
- The bill calculator provides estimates only; actual costs
  depend on individual orders.

---------------------------------------------------
REFERENCES
---------------------------------------------------
Images:
- hero.jpg: [Add your source, e.g. Unsplash — photographer name, URL]
- logo.png: [Add your source or note if original]
- restaurant1.jpg: [Add source]
- restaurant2.jpg: [Add source]
- restaurant3.jpg: [Add source]
- restaurant4.jpg: [Add source]
- restaurant5.jpg: [Add source]
- restaurant6.jpg: [Add source]

All restaurant names, descriptions, and prices are original
and fictional, created for this assignment.

No external JavaScript libraries were used.
Google Fonts were not used (system fonts only).

===================================================
