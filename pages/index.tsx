import type { NextPage } from "next";
import { Fragment } from "react";
import Content from "../components/Content";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";



export default function Home() {

  
  return (
    <Fragment>
      <img style={{margin:"20px 0px"}} src="images/logo-near.png" />
      <WalletSelectorContextProvider>
        <Content />

        
        
      </WalletSelectorContextProvider>
    </Fragment>
  )
}
