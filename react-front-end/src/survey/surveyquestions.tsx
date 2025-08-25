import React from "react";

export const questions = [
  {
    name: "age",
    label: "How satisfied are you with your quality of life today?",
    type: "number" as const,
    placeholder: "Enter your age",
  },
  {
    name: "health",
    label: "How's your health?",
    type: "text" as const,
    placeholder: "Enter your health",
  },{
      name: "location",
      label: "Where are you located?",
      type: "text" as const,
      placeholder: "Enter your location",
  },{ 
    name: "feedback",
    label: "Any additional feedback?",
    type: "textarea" as const,
    placeholder: "Enter your feedback",   
  },
    {
      label: "What's your favorite color?",
      name: "favoriteColor",
      type: "text",
      placeholder: "Enter your favorite color",
    },
    {
      name: "pet",
      label: "Do you have a pet?",
      type: "text",
      placeholder: "Check if you have a pet",
    },
    {
      name: "other",
      label: "Anything else you'd like to share?",
      type: "text",
      placeholder: "Enter your comments",
    },
    {
      name: "newsletter",
      label: "Would you like to subscribe to our newsletter?",
      type: "text",
      placeholder: "Check if you want to subscribe",
    },
    {
      name: "terms",
      label: "I agree to the terms and conditions",
      type: "text",
      placeholder: "Check if you agree",
    },{
      name: "other_concern",
      label: "Biggest concern for future care needs?",
      type: "text",
      placeholder: "Enter your comments",
    }
];

interface SurveyQuestionProps {
  question: typeof questions[number];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  value,
  onChange,
}) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", marginBottom: 8 }}>{question.label}</label>
    <input
      type={question.type}
      name={question.name}
      placeholder={question.placeholder}
      value={value}
      onChange={onChange}
      required
      style={{ width: "100%", padding: 8 }}
    />
  </div>
);

export default SurveyQuestion;