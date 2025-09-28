import CardNav from './CardNav'
import logo from '../assets/react.svg';
import { NAV_ITEMS } from '@/constants/constants';

const Header = () => {
    return (
        <header className="bg-zinc-950 text-white">
            <CardNav
                logo={logo}
                logoAlt="Tech-fest Logo"
                items={NAV_ITEMS}
                baseColor="#18181b" // zinc-900
                menuColor="#ffffff"
                buttonBgColor="blue" // zinc-700
                buttonTextColor="#ffffff"
                ease="power3.out"
                className="bg-zinc-950"
            />
        </header>
    );
};

export default Header;