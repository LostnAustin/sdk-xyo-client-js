import { delay } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import shajs from 'sha.js'

import { Words } from '../../Words'

export class XyoWalletBase {
  protected _phrase: string
  protected _name: string
  constructor(phrase: string, name = 'xyoWallet') {
    this._name = name
    this._phrase = phrase
  }

  public getAccount(index: number) {
    let counter = index
    let hash = shajs('sha256').update(this._phrase).digest().toString('hex')
    while (counter) {
      hash = shajs('sha256').update(hash).digest().toString('hex')
      counter--
    }
    return new XyoAccount({ privateKey: hash })
  }

  public static async generate() {
    //delay is here to prep for archivist load
    await delay(0)
    const wordList: string[] = []
    while (wordList.length < 16) {
      const index = Math.floor(Math.random() * Words.words.length)
      wordList.push(Words.words[index])
    }
    return new XyoWalletBase(wordList.join(' '))
  }
}