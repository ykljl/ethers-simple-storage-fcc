//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置

//该脚本主题:部署合约---1.设置gas交易上限2.获取部署合约时的初始值3.调用合约的函数与变量
//使用const让ethers变量无法改变,引入ethers包,获取能读取私钥的功能函数
const ethers = require("ethers");

//引入fs-extra包,获取能读取api与二进制文件的功能函数
const fs = require("fs-extra");
//import fs from "fs-extra";

async function main() {
  //连接到本地区块链,地址为http://172.30.16.1:7545
  const provider = new ethers.providers.JsonRpcProvider(
    "http://172.30.16.1:7545"
  );

  console.log("已连接到本地区块链!");

  // 连接到本地 Ganache 网络
  // 私钥（不要硬编码在代码中，实际项目请使用 .env 文件）
  const privateKey =
    "0x49613bcc7827416a1c0955ffc915a4b726fdc0a1eb5889a89be1a6ad4a237b1c";

  // 从私钥创建钱包并连接 provider
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("已连接到钱包!");

  //读取abi文件
  //abi文件是合约编译后生成的,包含合约的函数与变量,abi文件是json格式的,可以用fs-extra包读取
  //源代码:const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const abi = JSON.parse(
    fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  );
  console.log("已读取abi!");

  //读取二进制文件,二进制文件是合约编译后生成的,包含合约的字节码,二进制文件是utf8格式的,可以用fs-extra包读取
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  console.log("已读取二进制文件!");
  // 创建合约工厂,合约工厂是用来部署合约的,需要传入abi与二进制文件,合约工厂是一个类,可以用来创建合约实例,需要传入abi与二进制文件,合约实例是合约的一个对象,可以用来调用合约的函数与变量
  // abi让代码制定怎么跟合约交互,binary让代码知道合约的字节码,wallet提供一个私钥让我们能够用它签名并部署这个合约
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("以下开始部署合约:");
  //部署合约,使用awati关键字,让代码等待合约部署完成,然后返回一个合约实例
  const contract = await contractFactory.deploy({
    //设置gas交易上限
    gasLimit: 6721975,
    gasPrice: 1956101394,
  });
  //等待合约部署完成,然后返回一个合约实例
  // console.log(contract);

  //const deploymentReceipt = await contract.deployTransaction.wait(1);
  await contract.deployTransaction.wait(1);

  //get number=获取号码
  //获得开始部署合约时的初始值
  const currentFavoriteNumber = await contract.retrieve();
  onsole.log(`Current Favorite Number: ${currentFavoriteNumber}`);
  console.log("Updating favorite number...");

  //调用store函数,传入一个参数,花费gas,并等待交易完成
  let transactionResponse = await contract.store(7);

  let transactionReceipt = await transactionResponse.wait();
  currentFavoriteNumber = await contract.retrieve();
  console.log(`New Favorite Number: ${currentFavoriteNumber}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
