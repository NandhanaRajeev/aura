function Validation(values) {
    let errors = {};
    const email_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!values.name.trim()) {
        errors.name = "Name should not be empty";
    }

    if (!values.email.trim()) {
        errors.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        errors.email = "Invalid email format";
    }

    if (!values.password.trim()) {
        errors.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }

    return errors;
}

export default Validation;
