import { useState } from "react";
import { Input, Card, Button, Flex } from "antd";
// import 'antd/dist/antd.css';

const { TextArea } = Input;

const Task = () => {
  const [texts, setTexts] = useState([""]); // Start with one text area

  const handleTextChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const addCard = () => {
    setTexts([...texts, ""]);
  };

  return (
    <div>
        {texts.map((text, index) => ( 
            <Card key={index} style={{ "width": "100%", marginBottom: "20px" }}>
              <Flex>
                <TextArea
                  placeholder="It worked well that..."
                  value={text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
                <Button type="dashed" onClick={addCard}>
                  Add Card
                </Button>
              </Flex>
            </Card>
        ))}
    </div>
  );
};

export default Task;
