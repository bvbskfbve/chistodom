import type {Metadata} from 'next';
export const metadata:Metadata={title:'Моя заявка — ЧистоДом',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function PrivateOrderLayout({children}:{children:React.ReactNode}){return children;}
