import { authenticateStudent } from '../models/studentAuth.js'; // Import the student authentication function
import { staffAuth } from '../models/staffAuth.js';

export async function login(req, res){
    const { email, password } = req.body;
  
    try {

      const studentEmailRegex = /^[0-9]{2}[a-zA-Z]{2,3}[0-9]{3}@psgtech\.ac\.in$/;
      const staffEmailRegex = /^[a-z]+\.[a-z]+@psgtech\.ac\.in$/;
  
      if (!email || !password) {
        return res.render("login", { title: "Login Page", error: "Email and password are required!" });
      }
  
      if (studentEmailRegex.test(email)) {

        const studentResponse = await authenticateStudent(email, password);

        if (studentResponse.success) {

          req.session.student = {
            rollno : studentResponse.student.profile.rno,
            batch : studentResponse.student.profile.batch
          };

          return res.redirect('/student');

        } 
        else {
          return res.render("login", { title: "Login Page", error: "Invalid student credentials!" });
        }

      } else if (staffEmailRegex.test(email)) {

        const staffResponse = await staffAuth(email, password);
        

        if (staffResponse.success) {
          req.session.staff = {
            id : staffResponse.staff.id,
            dep : staffResponse.staff.department,
          }
          
          return res.redirect('/staff');
        } 
        else {
          return res.render("login", { title: "Login Page", error: "Invalid staff credentials!" });
        }

      } else {
        return res.render("login", { title: "Login Page", error: "Invalid email format!" });
      }

    } catch (error) {
      console.error('Error during login:', error.message);
      return res.render("login", { title: "Login Page", error: "An error occurred during login!" });
    }
  }

  
