async function authorize() {
    return new google.auth.JWT(process.env.GOOGLE_SHEETS_CLIENT_EMAIL, null, process.env.GOOGLE_SHEETS_PRIVATE_KEY.trim(), [
      "https://www.googleapis.com/auth/spreadsheets",
    ]);
  }

module.exports = {
    authorize
}