import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployMilestoneFunding: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MilestoneFunding", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployMilestoneFunding;

deployMilestoneFunding.tags = ["MilestoneFunding"];
