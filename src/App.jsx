import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  const address = useAddress();
  const editionDropAddress = "0x4b73aefE3E2d76734D8c4755e504ab8b7Ed693cD";
  const tokenAddress = "0x9365aa6bf3B287f6e56377287db6Ebb09fF17073";
  const { contract: token } = useContract(tokenAddress, 'token');
  console.log("👋 Address:", address);
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
const [memberAddresses, setMemberAddresses] = useState([]);

const shortenAddress = (str) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
};

useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
        0,
      );
      setMemberAddresses(memberAddresses);
      console.log('🚀 Members addresses', memberAddresses);
    } catch (error) {
      console.error('failed to get member list', error);
    }
  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop?.history]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token?.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log('👜 Amounts', amounts);
    } catch (error) {
      console.error('failed to get member balances', error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token?.history]);

const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || '0',
    };
  });
}, [memberAddresses, memberTokenAmounts]);
  
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to 🍪ManDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪ManDAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪ManDAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </div>
  );
}

export default App;