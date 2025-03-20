import { ActionPanel, Form, Action, showToast, Toast } from "@raycast/api";
import { runAppleScript } from "run-applescript";
import { useState } from "react"; // userState allows state management

export default function QuickAddToDaily() {
    // Use useState to track the input value
    const [text, setText] = useState("");

  async function handleSubmit(values: { text: string }) {
    try {
      // Format the text - if it doesn't start with a task marker, add one
      let taskText = values.text;
      if (!taskText.trim().startsWith("-") && !taskText.trim().startsWith("*")) {
        taskText = `* ${taskText}`;
      }
      
      // URL encode the text to be added
      const encodedText = encodeURIComponent(taskText);
      
      // Use AppleScript to open the x-callback-url
      const script = `
        do shell script "open 'noteplan://x-callback-url/addText?noteDate=today&text=${encodedText}&mode=append&openNote=no'"
      `;
      
      await runAppleScript(script);

      // Reset the input field after submission
      setText("");
      
      await showToast({
        style: Toast.Style.Success,
        title: "Added to today's note in NotePlan",
      });
    } catch (error) {
      console.error("Error adding to NotePlan:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to add to NotePlan",
        message: String(error),
      });
    }
  }
  
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add to Daily Note" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="text"
        title="Quick Note/Task"
        placeholder="Enter your thought or task..."
        value={text}
        onChange={setText}
        auto-Focus={true}
      />
    </Form>
  );
}