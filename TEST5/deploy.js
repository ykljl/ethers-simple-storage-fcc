//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置

//该脚本主题:部署合约---1.读取钱包 2.获取文件abi与二进制文件(该功能包一般由node.js直接提供)3.连接到本地区块链 4.部署合约
//使用const让ethers变量无法改变,引入ethers包,获取能读取私钥的功能函数
const ethers = require("ethers");

//引入fs-extra包,获取能读取api与二进制文件的功能函数
const fs = require("fs-extra");
//import fs from "fs-extra";

async function main() {
  //连接到本地区块链,地址为HTTP://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(
    "http://172.30.16.1:7545",
  );

  console.log("已连接到本地区块链");

  // 连接到本地 Ganache 网络
  // 私钥（不要硬编码在代码中，实际项目请使用 .env 文件）
  const privateKey =
    "0x49613bcc7827416a1c0955ffc915a4b726fdc0a1eb5889a89be1a6ad4a237b1c";

  // 从私钥创建钱包并连接 provider
  const wallet = new ethers.Wallet(privateKey, provider);

  //读取abi文件
  //abi文件是合约编译后生成的,包含合约的函数与变量,abi文件是json格式的,可以用fs-extra包读取
  //源代码:const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const abi = JSON.parse(
    fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8"),
  );

  //读取二进制文件,二进制文件是合约编译后生成的,包含合约的字节码,二进制文件是utf8格式的,可以用fs-extra包读取
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8",
  );
  //创建合约工厂,合约工厂是用来部署合约的,需要传入abi与二进制文件,合约工厂是一个类,可以用来创建合约实例,需要传入abi与二进制文件,合约实例是合约的一个对象,可以用来调用合约的函数与变量
  //abi让代码制定怎么跟合约交互,binary让代码知道合约的字节码,wallet提供一个私钥让我们能够用它签名并部署这个合约
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  //提示用户正在部署合约
  console.log("Deploying, please wait...");

  //部署合约,使用awati关键字,让代码等待合约部署完成,然后返回一个合约实例
  const contract = await contractFactory.deploy({
    //设置gas交易上限
    gasLimit: 6721975,
  });
  //等待合约部署完成,然后返回一个合约实例
  // console.log(contract);

  console.log("合约部署完成！");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
