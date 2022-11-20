import React, { Fragment, useCallback, useEffect, useState } from "react";
import { providers, utils } from "near-api-js";
import type {
  AccountView,
  CodeResult,
} from "near-api-js/lib/providers/provider";
import type { Transaction } from "@near-wallet-selector/core";
import type { Account } from "../interfaces";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { CONTRACT_ID } from "../constants";
import SignIn from "./SignIn";
import { NFTStorage, File } from 'nft.storage';
const nearAPI = require("near-api-js");
const SUGGESTED_DONATION = "0";
const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBDQ0Q2NTdGYkJkMDc4NmEyNWRlNTdDOTk0YTdDYTZjOWMwYzAzMDgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODkyMTA2MjExOSwibmFtZSI6Imxvb2t0YWIifQ.x5aovZo-jGMN5UL8GI3iECDZaRHaiVuZkegde5M9c6Q';



const Content: React.FC = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenName, setTokenName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState("");


  const { connect, keyStores, KeyPair, WalletConnection, Contract, utils } = nearAPI;

  const [fileName, setFileName] = useState('');
  const [uri, setUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');


  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);




  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setLoading(false);
    });
  }, [accountId, getAccount]);

  const handleSignIn = () => {
    modal.show();
  };

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  const handleSwitchWallet = () => {
    modal.show();
  };

  const handleSwitchAccount = () => {
    const currentIndex = accounts.findIndex((x) => x.accountId === accountId);
    const nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0;

    const nextAccountId = accounts[nextIndex].accountId;

    selector.setActiveAccount(nextAccountId);

    alert("Switched account to " + nextAccountId);
  };

  const addNFT = useCallback(
    async (params: any, e: any) => {
      const wallet = await selector.wallet();
      console.log(params.tokenName); // error
      e.preventDefault();

      const transactions: Array<Transaction> = [];


      const object = await {
        "title": params.tokenName,
        "description": params.description,
        "media": params.image,
        "copies": 1000,
        "reference": "https://near.org/",
      }

      transactions.push({
        signerId: accountId!,
        receiverId: CONTRACT_ID,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "nft_create_series",
              args: {
                "token_series_id": params.tokenName,
                "creator_id": accountId!,
                "token_metadata": object
              },
              gas: BOATLOAD_OF_GAS,
              deposit: utils.format.parseNearAmount(String(0.020))
            }
          }
        ]
      });

      transactions.push({
        signerId: accountId!,
        receiverId: CONTRACT_ID,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "nft_mint",
              args: {
                "token_series_id": params.tokenName,
                "receiver_id": accountId!,
              },
              gas: BOATLOAD_OF_GAS,
              deposit: utils.format.parseNearAmount(String(0.020))
            }
          }
        ]
      })
      return wallet.signAndSendTransactions({ transactions }).catch((err) => {
        alert("Failed to add nfts exception " + err);
        console.log("Failed to add nfts");

        throw err;
      });
    },
    [selector, accountId]
  );




  if (loading) {
    return null;
  }

  if (!account) {
    return (
      <Fragment>
        <div>
          <button onClick={handleSignIn}>Log in</button>
        </div>
        <img src="images/Looktab.png" style={{width: "100%", margin: "20px 0px"}}/>
        <SignIn />
        <hr />
        <div style={{display: "flex", flexDirection:"row", margin:"20px 0px"}}>
          <img src="/images/discord.png" style={{width: "33px", cursor: "pointer"}}/>
          <img src="/images/twitter.png" style={{width: "30px", margin:"0px 20px", cursor: "pointer"}}/>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div>
        <button onClick={handleSignOut}>Log out</button>
        <button onClick={handleSwitchWallet} style={{ marginLeft: "15px" }}>Switch Wallet</button>
        {accounts.length > 1 && (
          <button onClick={handleSwitchAccount}>Switch Account</button>
        )}
        
      </div>
      
      <hr />
      <h1>JUST TAP! NFT Reward Maker 🐥</h1>
          <div style={{display: "flex", flexDirection: "row"}}>
          <img src="/images/example.png" style={{width: "60%", margin: "20px 20px 20px 0px", display: "flex"}}/>
        <div style={{ display: "flex", flexDirection: "column"}}>
        <div>
            <h2>AD NFT - IMAGE 🧙🏻‍♀️</h2>
            <input
              type="text"
              placeholder="Paste NFT IMAGE URL"
              required
              onChange={(e) => setImage(e.target.value)}
              style={{ width: "250px", background: "white", borderColor: "white", color: "#272727", padding: "0px 10px", borderRadius: "5px", fontSize: "20px" }}
            />
          </div>
          <div>
            <h2>AD NFT - TITLE ✨</h2>
            <input
              type="text"
              placeholder="Please enter NFT Title"
              required
              onChange={(e) => setTokenName(e.target.value)}
              style={{ width: "250px", background: "white", borderColor: "white", color: "#272727", padding: "0px 10px", borderRadius: "5px", fontSize: "20px" }}
            />
          </div>
          <div>
            <h2>AD NFT - Description 🍎</h2>
            <textarea
              placeholder="Please enter NFT Description"
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "250px", background: "white", borderColor: "white", color: "#272727", padding: "0px 10px", borderRadius: "5px", fontSize: "20px" }}
            />
          </div>
          <button onClick={(e) => {addNFT({tokenName, description, image}, e)}} style={{width: "250px", margin: "20px 0px" }}>NFTMint</button>
        </div>
        </div>
    </Fragment>
  );
};

export default Content;