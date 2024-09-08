const {z} = require("zod");


const emailSchema = z.string().email({ message: "Invalid email address" });


const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });


const userNameSchema = z.string()
  .min(2, { message: "Full name must be at least 2 characters long" })
  .regex(/^[a-zA-Z\s]+$/, { message: "Full name can only contain letters and spaces" });


  const jobTitleSchema = z.string()
  .min(2, { message: "Job title must be at least 2 characters long" })
  .max(50, { message: "Job title can't exceed 50 characters" });


const departmentSchema = z.string()
  .min(2, { message: "Department must be at least 2 characters long" })
  .max(50, { message: "Department can't exceed 50 characters" })
  .regex(/^[a-zA-Z\s]+$/, { message: "Department can only contain letters and spaces" });


const descriptionSchema = z.string()
  .min(10, { message: "Description must be at least 10 characters long" })
  .max(500, { message: "Description can't exceed 500 characters" });


const openDateSchema = z.string()
  .regex(/^\d{4}[-\/]\d{2}[-\/]\d{2}$/, { message: "Open date must be in the format YYYY-MM-DD or YYYY/MM/DD" })
  .refine(date => !isNaN(new Date(date).getTime()), { message: "Invalid date format" });
  const jobIdSchema = z.number().int().positive({ message: "Job ID must be a positive integer" });


  const applicantNameSchema = z.string()
    .min(2, { message: "Applicant name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Applicant name can only contain letters and spaces" });
  
  
 
  const resumeLinkSchema = z.string()
    .url({ message: "Resume link must be a valid URL" });
  
  
  const statusSchema = z.enum(['Pending', 'Interviewed', 'Rejected', 'Hired'], {
    errorMap: () => ({ message: "Status must be one of: Pending, Interviewed, Rejected, Hired" })
  });
  
 
  const jobApplicationSchema = z.object({
    jobId: jobIdSchema,
    applicantName: applicantNameSchema,
    email: emailSchema,
    resumeLink: resumeLinkSchema,
    status: statusSchema,
  });

  const jobStatusSchema = z.object({
    status: statusSchema
  });

const jobDetailsSchema = z.object({
  jobTitle: jobTitleSchema,
  department: departmentSchema,
  description: descriptionSchema,
  openDate: openDateSchema,
});


const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});


const userSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userName: userNameSchema,
});


module.exports = {
  userLoginSchema,userSignupSchema,jobDetailsSchema,jobApplicationSchema,jobStatusSchema
}