import './Signup.css'

function Signup() {

    return (
        /*
         Please write all of your code in <main>

         NOTE: this needs to have a className of "fullscreen" so there are
          no conflicts between the CSS of the main part of the app
        */
        <main className="fullscreen">
            <h1>Sign up page. Should have the following info:</h1>

            {/* Notes
              Sign up page:
              Options:
                • Sign up as a Donor
                • Register your Food bank

              Sign up as a Donor:
                Select account type: Individual or Business
              For businesses:
                - Business type (restaurant or supermarket, this is for leaderboard)
                - Business name
                - Business description
                - email
                - password
         
              For Individual
                - Name
                - email
                - password

              Register food bank:
                - Food Bank name
                - Description
                - Describe your food prefrences (e.g. canned only)
            */}
            <p><br />Select between "Sign up as Donor" or "Register your food bank."</p>

        </main>
    )
}

export default Signup