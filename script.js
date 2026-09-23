const student = {
  name: "Anna",
  age: 20,
  city: "Yerevan",
  skills: ["HTML", "CSS", "JavaScript"]
};

const getStudentInfo = () => {
  const { name, age, city } = student;
  const status = age >= 18 ? "Adult" : "Minor";
  const react = student.skills.includes("React") ? "Knows React" : "Doesn't know React";

  return `${name} is ${age} years old and lives in ${city}. Status: ${status}. ${react}.`;
};
h 
console.log(getStudentInfo());