import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type SignOutProps = {
    socket: any;
    children?: React.ReactNode;
}

const SignOut: React.FC<SignOutProps> = ({socket, children}) => {
    const navigate = useNavigate()
    const handleSignout = () => {
        sessionStorage.removeItem('userName')
        socket.emit('signout')
        navigate('/')
    }

    return (
        <Button onClick={handleSignout} className="mt-2">Sign Out</Button>
    )
}

export default SignOut;