import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Header from '../../components/Header'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../../components/NFTCard'

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Collection = () => {
  const router = useRouter()
  const { provider } = useWeb3()
  const { collectionId } = router.query
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])

  //https://eth-rinkeby.alchemyapi.io/v2/aPadJ0CBJuV2y4GwJzoief0bSCbGGZwA

  const nftModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
      'https://eth-rinkeby.alchemyapi.io/v2/aPadJ0CBJuV2y4GwJzoief0bSCbGGZwA'
    )
    return sdk.getNFTModule(collectionId)
  }, [provider])

  // get all NFTs in the collection
  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()

      setNfts(nfts)
    })()
  }, [nftModule])

  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
      'https://eth-rinkeby.alchemyapi.io/v2/aPadJ0CBJuV2y4GwJzoief0bSCbGGZwA'
    )
    return sdk.getMarketplaceModule(  
      '0x731e1e9275067685285c7041F876061044Dc68f7'
    )
  }, [provider])

  // get all listings in the collection
  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      setListings(await marketPlaceModule.getAllListings())
    })()
  }, [marketPlaceModule])

  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "0x2d15766801DdCa850D9b5536C419215E9317bc81" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)

    console.log(collectionData, '🔥')

    // the query returns 1 object inside of an array
    await setCollection(collectionData[0])
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

  console.log(router.query)
  console.log(router.query.collectionId)
  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : 'https://cdn.sanity.io/images/rdv8uglu/production/dd6e2e1e98296c816ba3a83ef65589454c39024e-1600x1000.jpg'
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : 'data:image/png;base64,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'
            }
            alt="profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{' '}
            <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {collection?.allOwners ? collection.allOwners.length : ''}
              </div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}.5K
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap ">
        {nfts.map((nftItem, id) => (
          <NFTCard
            key={id}
            nftItem={nftItem}
            title={collection?.title}
            listings={listings}
          />
        ))}
      </div>
    </div>
  )
}

export default Collection
