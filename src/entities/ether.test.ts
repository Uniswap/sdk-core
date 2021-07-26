import { Ether } from './ether'

describe('Ether', () => {
  it('static constructor returns a new Ether object', () => {
    expect(
      Ether.onChain(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') !==
        Ether.onChain(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
    ).toEqual(true)
  })
  it('#equals returns false for diff chains, same addresses', () => {
    expect(
      Ether.onChain(1, '0xc778417e063141139fce010982780140aa0cd5ab').equals(
        Ether.onChain(2, '0xc778417e063141139fce010982780140aa0cd5ab')
      )
    ).toEqual(false)
  })
  it('#equals returns false for diff chains, diff addresses', () => {
    expect(
      Ether.onChain(1, '0xc778417e063141139fce010982780140aa0cd5ab').equals(
        Ether.onChain(2, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
      )
    ).toEqual(false)
  })
  it('#equals returns true for same chains, same addresses', () => {
    expect(
      Ether.onChain(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2').equals(
        Ether.onChain(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
      )
    ).toEqual(true)
  })
  it('#equals returns true for same chains, diff addresses', () => {
    expect(
      Ether.onChain(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2').equals(
        Ether.onChain(1, '0xc778417e063141139fce010982780140aa0cd5ab')
      )
    ).toEqual(true)
  })
})
