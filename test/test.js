const {expect} = require('chai')

const {ethers} = require('hardhat')


describe("hex Source test",async function(){

    let owner, addr1,addr2;
  let HEX;
  let PrizePool;
  let ticketContract;
  let hexYield;
  let impersonatedSigner;

  describe("",async function () {

    beforeEach("before Each", async ()=>{

      [owner,addr1,addr2] = await ethers.getSigners();
      // impersonatedSigner = await ethers.getImpersonatedSigner("0x2BDE3b9C0129be4689E245Ba689b9b0Ae4AC666D");



      const Hex = await ethers.getContractFactory("HEX");
      const hex = await Hex.deploy();
      HEX = await hex.deployed();
      console.log(HEX.address)

      const HexSource = await ethers.getContractFactory("HexSource");
      const hexsource = await HexSource.deploy(HEX.address);
      hexYield = await hexsource.deployed();

      console.log(hexYield.address)

      const YieldSourcePrizePool = await ethers.getContractFactory("PrizePool");
      const yieldsourceprizepool = await YieldSourcePrizePool.deploy(hexYield.address);
      PrizePool = await yieldsourceprizepool.deployed();

      console.log(PrizePool.address)

      const Tickets = await ethers.getContractFactory("Ticket");
      const ticket = await Tickets.deploy(PrizePool.address);
      ticketContract = await ticket.deployed();

      await PrizePool.setTicket(ticketContract.address);
      await HEX.hexMint(owner.address,10000);
      await HEX.hexMint(addr1.address,10000);
      await HEX.hexMint(addr2.address,10000);
      await HEX.approve(PrizePool.address,10000)
      await HEX.connect(addr1).approve(PrizePool.address,10000)
      await HEX.connect(addr2).approve(PrizePool.address,10000)


    })
    it("the hex token transferred to the Hexyield and ticket total Supply",async ()=>{
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      expect(await HEX.balanceOf(hexYield.address)).to.equal(await ticketContract.totalSupply())
      console.log("Total Sypply",await ticketContract.totalSupply())
    });

    it("the hex token transferred to the Hexyield and ticket total Supply",async ()=>{
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      expect(await HEX.balanceOf(hexYield.address)).to.equal(await ticketContract.totalSupply())
    });

    it("The token should be burned after depositing in the yield source",async ()=>{
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      await hexYield.supplyToYield(10)
      expect(await HEX.balanceOf(hexYield.address)).to.equal(0);

    })

    it("The token should be stored in globalInfo() in HEX after depositing",async ()=>{
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      await hexYield.supplyToYield(10)
      expect(await HEX.balanceOf(hexYield.address)).to.equal(0);
      const infoG=await HEX.globalInfo();
      console.log("Global Info",infoG)

      expect(infoG[0]).to.equal(await ticketContract.totalSupply())

    })

    it("The stakeLists() stakedHex in HEX should be updated after depositing",async ()=>{
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      await hexYield.supplyToYield(10)
      const stakedList = await HEX.stakeLists(hexYield.address,0);
      console.log(stakedList)
      expect(stakedList[1]).to.equal(3000)
  
    })

    it("The stakeLists() stakedDays in HEX should be updated after depositing",async ()=>{
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      await hexYield.supplyToYield(10)
      const stakedList = await HEX.stakeLists(hexYield.address,0);
      expect(stakedList[4]).to.equal(10)
  
    })

    it("The stakeLists() second deposit should be in index 1 in HEX should be updated after depositing",async ()=>{
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      await hexYield.supplyToYield(10)

      await PrizePool.depositTo(1000)
      await PrizePool.depositTo(1000)
      
      await PrizePool.connect(addr1).depositTo(1000)
      await PrizePool.connect(addr2).depositTo(1000)

      await hexYield.supplyToYield(10)

      const stakedList = await HEX.stakeLists(hexYield.address,1);
      console.log(stakedList)
      expect(stakedList[1]).to.equal(4000)
  
    })
  })

    


 


})