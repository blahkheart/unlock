const { ethers } = require('hardhat')

module.exports = async () => {
  const recipientAddress = '0x61D22c34455A11A16C61aC2168b68F38377E5Ea5'
  const transferAmount = ethers.parseEther('2.0')

  const calls = [
    {
      contractAddress: recipientAddress,
      calldata: '0x', // empty calldata for ETH transfer
      value: transferAmount,
    },
  ]

  const proposalName = `# Approve 2 ETH Sponsorship for Carrot Castle at EthDenver 2025

    ### Goal of the proposal
    This proposal requests Unlock DAO to sponsor Carrot Castle at EthDenver 2025 as a **Tier 1 Sponsor** with **2 ETH**. The event is focused on exploring grant funding within the Web3 ecosystem and fostering collaboration between leading innovators.

    #### About the proposal
    - **Unlock Protocol is already being used for ticketing at the event**, showcasing its real-world applications.
    - **1.5 ETH** will be used as grant rewards in a custom Unlock DAO grant round.
    - **0.5 ETH** will go towards event and grant administration.
    - Unlock representatives will have **dedicated office hours** and **a hands-on workshop** for onboarding participants.
    - Unlock’s branding will be prominently featured, including **logos on promotional content** and **SWAG distribution** throughout the week.
    - Unlock will be integrated into event quests, driving engagement beyond the venue.

    #### Risks
    - This is the **first** Carrot Castle event, and its broader success will depend on community engagement.
    - Unlock representatives' participation is key to maximizing the value of office hours and the workshop.
    - Denver is **cold in the winter** – dress accordingly!

    #### Timeline & Implementation
    - **Event Dates:** February 23rd – March 2nd, 2025
    - **Deliverables:**
    - 2 ETH sponsorship allocation
    - Unlock DAO representatives’ schedule for office hours and workshops
    - SWAG distribution during the event

    #### Voting Evaluation
    - **For** – Approve 2 ETH sponsorship and Tier 1 Sponsor status.
    - **Against** – Reject sponsorship.
    - **Abstain** – Participate in quorum without a preference.

    For the full proposal, visit: [Snapshot Proposal](https://snapshot.box/#/s:unlock-dao.eth/proposal/0xf5b3d40dcfa6f820a306eeaa061c0b667e0ec537e150303c27196ddcd1a8f896)

    `

  return {
    proposalName,
    calls,
  }
}
