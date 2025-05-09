'use client'

import { Button } from '@unlock-protocol/ui'
import Link from 'next/link'
import { LockTypeLandingPage } from '~/components/interface/LockTypeLandingPage'
import Image from 'next/image'

const customers = [
  {
    image: '/images/partners/berchain.svg',
    name: 'Berchain',
  },
  {
    image: '/images/partners/metacartel-full.svg',
    name: 'Metacartel',
  },
  {
    image: '/images/partners/ethcc.svg',
    name: 'ETHcc',
  },
  {
    image: '/images/partners/polygonnyc-logo.png',
    name: 'Polygon NYC',
  },
  {
    image: '/images/partners/ethwarsaw.svg',
    name: 'Eth Warsaw',
  },
  {
    image: '/images/partners/ethchi.svg',
    name: 'EthChi',
  },
  {
    image: '/images/partners/womeninweb3.svg',
    name: 'Women in Web3',
  },
  {
    image: '/images/partners/farcon.png',
    name: 'Farcon logo',
  },
  {
    image: '/images/partners/dappcon.svg',
    name: 'DappCon logo',
  },
  {
    image: '/images/partners/ethsafari.svg',
    name: 'EthSafari',
  },
]

const features = [
  {
    image: '/images/illustrations/events/qr.svg',
    name: 'QR codes and proof of purchase ticketing',
    description:
      'The easiest way to authenticate tickets. Once an attendee purchases a ticket, they will receive an email along with a QR code to check in at the venue.',
  },
  {
    image: '/images/illustrations/events/verifier.svg',
    name: 'Check-ins at the venue are a breeze',
    description:
      'Volunteers or door staff can check attendees in with just a smartphone, and ensure tickets aren’t transferred or reused once someone has come through the door.',
  },
  {
    image: '/images/illustrations/events/imgoing.svg',
    name: 'Increase attendance rates up to 90%',
    description:
      '“I’m Going!” commitment feature requires attendees to stake a small amount of money when RSVPing for free events which they get as a “kickback” if they attend, while no-shows forfeit their commitment.',
  },
]

const problems = [
  {
    image: '/images/illustrations/events/img-stuck.svg',
    name: 'No-code smart contract deployment',
    description:
      "Your web3 or crypto event isn't walking the walk, and is using a legacy ticketing solution like Eventbrite, Meetup or Luma instead of embracing the very technology your attendees expect you to champion.",
  },
  {
    image: '/images/illustrations/events/img-wallet.svg',
    name: 'QR codes and proof of purchase ticketing',
    description:
      "You're losing money on ticket sales because of upsells, hidden fees, and slow payouts from your existing ticketing provider.",
  },
  {
    image: '/images/illustrations/events/img-goodvibe.svg',
    name: 'Check-ins at the venue are a breeze',
    description:
      'Your attendees stop engaging the moment the event is over, and are not continuing conversations as an ongoing, connected community.',
  },
]

const faqs = [
  {
    title: 'Will attendees need wallets?',
    description:
      'No! Attendees do not need wallets, but they will need user accounts if they do not have their own wallets. Unlock accounts require an email and password.',
  },
  {
    title: 'What blockchain is this on?',
    description: (
      <>
        <p>
          You can pick between{' '}
          <Link
            className="underline"
            target="_blank"
            href={
              'https://docs.unlock-protocol.com/core-protocol/unlock/networks'
            }
          >
            all the networks on which the Unlock Protocol
          </Link>{' '}
          has been deployed: Polygon, Gnosis Chain, Optimism, ...
        </p>
      </>
    ),
  },
  {
    title: 'Can I charge for the tickets?',
    description:
      'Yes, when deploying your contract you can pick a currency, as well as enable credit card, Apple Pay and Google Pay.',
  },
  {
    title: 'Are attendees receiving tickets?',
    description:
      'Yes they are! Once the blockchain transaction is completed, they will receive an email that includes a ticket. On this ticket there is a unique QR code that can be scanned by organizers to verify its validity. Additionally, verifiers can redeem the QR code so that if another attendee arrives with the same QR code, they will be rejected!',
  },
]

interface EventLandingPageCallToActionProps {
  handleCreateEvent: () => void
}

export const EventLandingPageCallToAction = ({
  handleCreateEvent,
}: EventLandingPageCallToActionProps) => {
  return (
    <Button onClick={handleCreateEvent} className="my-8">
      Get started for free
    </Button>
  )
}

interface LandingPageProps {
  handleCreateEvent: () => void
}
export const EventLandingPage = ({ handleCreateEvent }: LandingPageProps) => {
  return (
    <>
      <LockTypeLandingPage
        title={
          <h1
            style={{
              backgroundImage:
                'linear-gradient(85.7deg, #603DEB 3.25%, #F19077 90.24%)',
            }}
            className="text-5xl font-extrabold text-transparent uppercase md:text-7xl bg-clip-text"
          >
            Easy-peasy event tickets and registration
          </h1>
        }
        actions={
          <EventLandingPageCallToAction handleCreateEvent={handleCreateEvent} />
        }
        illustration={
          <Image
            width="501"
            height="309"
            alt="Farcon uses Events by Unlock"
            src="/images/illustrations/events/farcon-hero.png"
          />
        }
        coverImage="/images/illustrations/events/party.svg"
        subtitle="Create event tickets and landing pages for your conference, event, or meetup in under
       five minutes with Unlock Protocol."
        description="Create events in the easiest possible way. Set up
       your event landing page, sell or airdrop tickets as NFTs and via email,
        and perform check-in with a dedicated QR code. Easy."
        customers={{
          title:
            'Trusted by event organizers and community meetups around the world',
          items: customers,
        }}
        faqs={faqs}
        features={features}
        problemSection={{
          title: 'The Problem',
          subtitle:
            "Legacy ticketing solutions don't meet the needs of web3 and crypto event organizers",
          items: problems,
        }}
        callToAction={{
          title: 'Ticketing events with Unlock is simple.',
          subtitle:
            'From creating the event description to selling tickets to check-in, Unlock built the tools you need.',
          description:
            'Psst, you can also Airdrop tickets to frens or have them stake. Just cherry on your sundae for other customization.',
          actions: (
            <EventLandingPageCallToAction
              handleCreateEvent={handleCreateEvent}
            />
          ),
        }}
      />
    </>
  )
}
