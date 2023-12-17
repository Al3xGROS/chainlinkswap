import { Swapper } from '../components/Swap'
import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import Navbar from "../components/Navbar"

function Swap() {
    return(
        <>
            <div className='flex flex-row justify-between my-7'>
                <Navbar />
                <div className='mx-5'>
                    <ConnectButton />
                </div>
            </div>
            <Connected>
                <Swapper/>
            </Connected>
        </>
    )
}

export default Swap