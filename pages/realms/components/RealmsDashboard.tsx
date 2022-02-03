import useQueryContext from '@hooks/useQueryContext'
import { RealmInfo } from '@models/registry/api'
import { useRouter } from 'next/router'
import React from 'react'
import Loading from '@components/Loading'
import useWalletStore from 'stores/useWalletStore'
import Button from '@components/Button'
import { notify } from '@utils/notifications'

///////////////////////////Masaya Added////////////////////////////////
//token price
// import useGovernanceAssets from '@hooks/useGovernanceAssets'
// import { getMintDecimalAmountFromNatural } from '@tools/sdk/units'
// import tokenService from '@utils/services/token'
// import BigNumber from 'bignumber.js'
// import { BN } from '@project-serum/anchor'

//# of members
import useMembers from '@components/Members/useMembers'

export default function RealmsDashboard({
  realms,
  isLoading,
  showNewButton,
  header = 'Organisations',
}: {
  realms: readonly RealmInfo[]
  isLoading: boolean
  showNewButton?: boolean
  header?: string
}) {
  const router = useRouter()
  const { fmtUrlWithCluster } = useQueryContext()
  const { connected, current: wallet } = useWalletStore((s) => s)

  const goToRealm = (realmInfo: RealmInfo) => {
    const symbol =
      realmInfo.isCertified && realmInfo.symbol
        ? realmInfo.symbol
        : realmInfo.realmId.toBase58()
    const url = fmtUrlWithCluster(`/dao/${symbol}`)
    router.push(url)
  }

  const handleCreateRealmButtonClick = async () => {
    if (!connected) {
      try {
        if (wallet) await wallet.connect()
      } catch (error) {
        const err = error as Error
        return notify({
          type: 'error',
          message: err.message,
        })
      }
    }
    router.push(fmtUrlWithCluster(`/realms/new`))
  }

  /////////////////////////////////////////////////////////////////////

  //Variables
  const { activeMembers } = useMembers()

  //need to figure out how to reference the search for total price

  //onMouseEnter of container div, console.log(data)
  function getSummaryOfData(e) {
    //id and active member amount
    console.log(e._targetInst.key, activeMembers.length)
  }

  //Function from HoldTokensTotalPrice to calculate into USD price

  // const { governedTokenAccountsWithoutNfts } = useGovernanceAssets()
  // function calcTotalTokensPrice(e) {
  //   const totalPrice = governedTokenAccountsWithoutNfts
  //     .filter(
  //       (x) => typeof x.mint !== 'undefined' && typeof x.token !== 'undefined'
  //     )
  //     .map((x) => {
  //       return (
  //         getMintDecimalAmountFromNatural(
  //           x.mint!.account,
  //           new BN(x.token!.account.amount)
  //         ).toNumber() *
  //         tokenService.getUSDTokenPrice(x.token!.account.mint.toBase58())
  //       )
  //     })
  //     .reduce((acc, val) => acc + val, 0)

  //   return console.log(totalPrice ? new BigNumber(totalPrice).toFormat(0) : '')
  // }

  /////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      {/* Re-instate when there are enough REALMs for this to be useful. Maybe > 25 */}
      {/* <div className="mb-10 flex">
            <Input
              value={search}
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search here...`}
            />
            <div className="flex flex-row ml-10">
              <Button className="mr-3" onClick={() => setViewType(COL)}>
                List
              </Button>
              <Button onClick={() => setViewType(ROW)}>Columns</Button>
            </div>
          </div> */}
      <div className="flex w-full justify-between mb-6">
        <h1>{header}</h1>
        {showNewButton && (
          <Button className="px-10 " onClick={handleCreateRealmButtonClick}>
            Create DAO
          </Button>
        )}
      </div>
      <div
        className={`grid grid-flow-row grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4`}
      >
        {isLoading ? (
          <Loading></Loading>
        ) : (
          <>
            {realms?.map((realm: RealmInfo) => (
              <div
                onMouseEnter={(e) => getSummaryOfData(e)}
                onClick={() => goToRealm(realm)}
                className="bg-bkg-2 cursor-pointer default-transition flex flex-col items-center p-8 rounded-lg hover:bg-bkg-3"
                key={realm.realmId.toString()}
              >
                <div className="pb-5">
                  {realm.ogImage ? (
                    <div className="bg-[rgba(255,255,255,0.06)] rounded-full h-16 w-16 flex items-center justify-center">
                      <img className="w-10" src={realm.ogImage}></img>
                    </div>
                  ) : (
                    <div className="bg-[rgba(255,255,255,0.06)] h-16 w-16 flex font-bold items-center justify-center rounded-full text-fgd-3">
                      {realm.displayName?.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-center break-all">
                  {realm.displayName ?? realm.symbol}
                </h3>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
