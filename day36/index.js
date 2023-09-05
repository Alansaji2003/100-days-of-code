import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';


inquirer
  .prompt([
    {message: "Enter the URL you want to convert to QR Code",
    name: "URL"

  }])
  .then((answers) => {
    const url = answers.URL;
    // Use user feedback for... whatever!!
    var qr_svg = qr.image(url, { type: 'png' });
    qr_svg.pipe(fs.createWriteStream('qr.png'));
    fs.writeFile("URL.txt", url, (err)=> {
        if (err) throw err
        console.log("URL saved on URL.txt");
    })

  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.log("Prompt couldn't be rendered in the current environment")
    } else {
      // Something else went wrong
      console.log("Something else went wrong")
    }
  });