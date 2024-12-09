import { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";

type ChatProviderProps = {
    socket: any;
}

type Message = {
    text: string;
    userId: string;
}

const ChatProvider: React.FC<ChatProviderProps> = ({socket}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const userId = sessionStorage.getItem('userName');
    const messageEndRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        socket.on("message", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("message");
        };
    }, [socket]); 

    // Scroll to the bottom when a new message arrives
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // Re-run this effect every time messages change

    return (
        <Container
            style={{
                marginTop: '40px',
                background: 'lightblue',
                padding: '20px',
                borderRadius: '10px',
                maxHeight: '400px',
                overflowY: 'auto',  
            }}
        >
            <div>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: '10px',
                            textAlign: message.userId === userId ? 'right' : 'left',
                            color: message.userId === userId ? 'blue' : 'green',
                            fontSize: '16px',
                        }}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <div ref={messageEndRef} /> 
        </Container>
    );
}

export default ChatProvider;
