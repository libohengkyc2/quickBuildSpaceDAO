import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const token = await sdk.getContract(process.env.INSERT_TOKEN_ADDRESS, "token");
    const amount = 1_000_000;
    await token.mint(amount);
    const totalSupply = await token.totalSupply();
    console.log("✅ There now is", totalSupply.displayValue, "$MDT in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();