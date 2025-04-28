//代码准则:1.注意标点符号是否错了,或多了,或少了2.注意某些命令是否确实某个字母3.注意代码是否闭合(少了个括号或者}号)4.注意导入库,模块,文件的版本与位置

//该脚本主题:学习 TypeScript版本,格式

//TypeScript版本导入格式
import { ethers } from "ethers";
import * as fs from "fs-extra";
import "dotenv/config";

// //使用const让ethers变量无法改变,引入ethers包,获取能读取私钥的功能函数
// const ethers = require("ethers");

// //引入fs-extra包,获取能读取api与二进制文件的功能函数
// const fs = require("fs-extra");
// //import fs from "fs-extra";

// //引入环境变量
// require("dotenv").config();

async function main() {
  //连接到本地区块链,使用process命令,读取.env文件(环境变量)中的RPC_URL(网络地址)
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!);

  console.log("已连接到测试网块链!");

  // 连接到本地 Ganache 网络
  // // 使用process命令,读取.env文件(环境变量)中的PRIVATE_KEY(私钥)
  // const privateKey = "process.env.PRIVATE_KEY";

  // 从私钥创建钱包并连接 provider
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  //使用加密后的私钥,创建钱包并连接provider
  //读取加密后的私钥文件,使用fs-extra包读取,读取的文件是utf8格式的
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");

  //使用ethers包中的Wallet类,从加密后的私钥文件中创建钱包,并传入私钥密码
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD,
  // );
  // wallet = await wallet.connect(provider);

  console.log("已连接到钱包!");

  //读取abi文件
  //abi文件是合约编译后生成的,包含合约的函数与变量,abi文件是json格式的,可以用fs-extra包读取
  //源代码:const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  console.log("已读取abi!");

  //读取二进制文件,二进制文件是合约编译后生成的,包含合约的字节码,二进制文件是utf8格式的,可以用fs-extra包读取
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8",
  );
  console.log("已读取二进制文件!");
  // 创建合约工厂,合约工厂是用来部署合约的,需要传入abi与二进制文件,合约工厂是一个类,可以用来创建合约实例,需要传入abi与二进制文件,合约实例是合约的一个对象,可以用来调用合约的函数与变量
  // abi让代码制定怎么跟合约交互,binary让代码知道合约的字节码,wallet提供一个私钥让我们能够用它签名并部署这个合约
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("以下开始部署合约:");
  //部署合约,使用awati关键字,让代码等待合约部署完成,然后返回一个合约实例
  const contract = await contractFactory.deploy();
  //等待合约部署完成,然后返回一个合约实例
  // console.log(contract);

  //const deploymentReceipt = await contract.deployTransaction.wait(1);
  await contract.deployTransaction.wait(1);
  console.log(`合同地址: ${contract.address}`);
  console.log("合约部署完成!");

  //get number=获取号码
  //获得开始部署合约时的初始值
  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);

  //调用store函数,传入一个参数,花费gas,并等待交易完成
  const transactionResponse = await contract.store(7);

  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`updated favorite number: ${updatedFavoriteNumber}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
