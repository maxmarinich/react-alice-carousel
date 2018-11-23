import * as Utils from '../../../app/components/utils'

describe('utils', () => {
  describe('elements', () => {
    const children = [1, 2, 3]
    const stagePadding = { paddingLeft: 10, paddingRight: 20 }

    describe('cloneCarouselItems, return cloned items, []', () => {
      it('should return default value', () => {
        expect(Utils.cloneCarouselItems()).toEqual([])
      })

      it('should return expected value if single children and not items', () => {
        expect(Utils.cloneCarouselItems([1])).toEqual([1, 1, 1])
      })

      it('should return expected value if children more than items', () => {
        expect(Utils.cloneCarouselItems(children, 2)).toEqual([2, 3, ...children, 1, 2])
      })

      it('should return expected value if children equal items', () => {
        expect(Utils.cloneCarouselItems(children, 3)).toEqual([...children, ...children, ...children])
      })

      it('should return expected value if children less than items', () => {
        expect(Utils.cloneCarouselItems(children, 4)).toEqual([...children, ...children, ...children])
      })

      it('should return expected value if infinite and not padding', () => {
        const data = Utils.cloneCarouselItems(children, 1, { infinite: true })
        expect(data).toEqual([3, ...children, 1])
      })

      it('should return expected value if infinite, padding and items less than children', () => {
        const data = Utils.cloneCarouselItems(children, 1, {
          stagePadding,
          infinite: true,
        })
        expect(data).toEqual([2, 3, ...children, 1, 2])
      })

      it('should return expected value if infinite, padding and items equal children', () => {
        const data = Utils.cloneCarouselItems(children, 3, {
          stagePadding,
          infinite: true,
        })
        expect(data).toEqual([3, ...children, ...children, ...children, 1])
      })

      it('should return expected value if infinite, padding and items more than children', () => {
        const data = Utils.cloneCarouselItems(children, 4, {
          stagePadding,
          infinite: true,
        })
        expect(data).toEqual([3, ...children, ...children, ...children, 1])
      })
    })

    describe('getStagePadding, return plan object, {}', () => {
      it('should return default value', () => {
        expect(Utils.getStagePadding()).toEqual({
          paddingLeft: 0,
          paddingRight: 0,
        })
      })

      it('should return expected value', () => {
        expect(Utils.getStagePadding({ stagePadding })).toEqual(stagePadding)
      })

      it('should return expected paddingLeft value', () => {
        const { paddingLeft } = Utils.getStagePadding({ stagePadding })
        expect(paddingLeft).toEqual(10)
      })

      it('should return expected paddingRight value', () => {
        const { paddingRight } = Utils.getStagePadding({ stagePadding })
        expect(paddingRight).toEqual(20)
      })
    })

    describe('isElement, return info is instance a valid html element, boolean', () => {
      const element = document.createElement('div')

      it('should return true', () => {
        expect(Utils.isElement(element)).toEqual(true)
      })

      it('should return false', () => {
        expect(Utils.isElement()).toEqual(false)
      })
    })

    describe('getElementWidth, return element width, number', () => {
      const element = document.createElement('div')

      it('should return expected value', () => {
        expect(Utils.getElementWidth(element)).toEqual(0)
      })

      it('should return undefined', () => {
        expect(Utils.getElementWidth()).toEqual(undefined)
      })
    })

    describe('getItemWidth, return gallery item width, number', () => {
      it('should return default value', () => {
        expect(Utils.getItemWidth()).toEqual(0)
      })

      it('should return expected value if items equal 0 ', () => {
        expect(Utils.getItemWidth()).toEqual(0)
      })

      it('should return expected value if items more than 0 ', () => {
        expect(Utils.getItemWidth(10, 2)).toEqual(5)
      })
    })

    describe('getSlides, return gallery items, []', () => {
      it('should return expected value', () => {
        expect(Utils.getSlides()).toEqual([])
      })

      it('should return expected value if slides length', () => {
        expect(Utils.getSlides({ children: [1], items: [2] })).toEqual([1])
      })
    })

    describe('getSlideInfo, return slide info, {}', () => {
      it('should return default value', () => {
        expect(Utils.getSlideInfo()).toEqual({ slideIndex: 1, slidesLength: 0 })
      })

      it('should return expected value if index less than 0', () => {
        expect(Utils.getSlideInfo(-1, 2)).toEqual({
          slideIndex: 2,
          slidesLength: 2,
        })
      })

      it('should return expected value if index more than slides length', () => {
        expect(Utils.getSlideInfo(5, 2)).toEqual({
          slideIndex: 1,
          slidesLength: 2,
        })
      })

      it('should return expected value if index less than slides length', () => {
        expect(Utils.getSlideInfo(1, 2)).toEqual({
          slideIndex: 2,
          slidesLength: 2,
        })
      })

      it('should return expected value if index equal slides length', () => {
        expect(Utils.getSlideInfo(2, 2)).toEqual({
          slideIndex: 1,
          slidesLength: 2,
        })
      })
    })

    describe('itemInfo, return item info, {}', () => {
      it('should return default value', () => {
        expect(Utils.itemInfo()).toEqual({
          inactivePrev: false,
          inactiveNext: false,
        })
      })

      it('should return expected value if infinite not equal false', () => {
        const data = Utils.itemInfo({ items: 1, currentIndex: 1, slides: [] })
        expect(data).toEqual({ inactivePrev: false, inactiveNext: false })
      })

      it('should return expected value if infinite equal false && currentIndex equal 0', () => {
        const data = Utils.itemInfo({ infinite: false, currentIndex: 0 })
        expect(data).toEqual({ inactivePrev: true, inactiveNext: false })
      })

      it('should return expected value if infinite equal false, currentIndex not equal 0', () => {
        const params = { items: 1, infinite: false, currentIndex: 1, slides: [1, 3] }
        const data = Utils.itemInfo(params)
        expect(data).toEqual({ inactivePrev: false, inactiveNext: true })
      })

      it('should return expected value if infinite equal false, slides minus items equal currentIndex', () => {
        const params = { items: 3, infinite: false, currentIndex: 0, slides: [1, 2, 3] }
        const data = Utils.itemInfo(params)
        expect(data).toEqual({ inactivePrev: true, inactiveNext: true })
      })

      it('should return expected value if infinite equal false, slides minus items not equal currentIndex', () => {
        const params = { items: 2, infinite: false, currentIndex: 0, slides: [1, 2, 3] }
        const data = Utils.itemInfo(params)
        expect(data).toEqual({ inactivePrev: true, inactiveNext: false })
      })
    })

    describe('getNextItemIndexBeforeTouchEnd, return item info, {}', () => {
      const position = 300
      const stagePadding = { paddingLeft: 1, paddingRight: 1 }
      const params = { itemWidth: 100, items: 1, infinite: true, slides: [1, 2, 3] }

      it('should return default data  if itemWidth equal 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { itemWidth: 0 })
        expect(data).toEqual(0)
      })

      it('should return default data if items greater than slides', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, items: 4 })
        expect(data).toEqual(0)
      })

      it('should return expected data if infinite && not stage adding', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, params)
        expect(data).toEqual(2)
      })

      it('should return expected data if infinite && stage adding', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding })
        expect(data).toEqual(1)
      })

      it('should return expected data if infinite, stage padding && index equal slides', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, slides: [1] })
        expect(data).toEqual(0)
      })

      it('should return expected data if infinite, stage padding && index less than 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, items: 3 })
        expect(data).toEqual(2)
      })

      it('should return expected data if infinite, stage padding && index equal 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, items: 2 })
        expect(data).toEqual(0)
      })

      it('should return expected data if infinite, stage padding && index more than 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, items: 1 })
        expect(data).toEqual(1)
      })

      it('should return expected data if infinite, not stage padding && index equal slides', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(400, params)
        expect(data).toEqual(0)
      })

      it('should return expected data if infinite, not stage padding && index not equal slides', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, params)
        expect(data).toEqual(2)
      })

      it('should return expected data if infinite, not stage padding && index equal 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, items: 3})
        expect(data).toEqual(0)
      })

      it('should return expected data if infinite, not stage padding && index more than 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, items: 2})
        expect(data).toEqual(1)
      })

      it('should return expected data if infinite, not stage padding && index less than 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(100, { ...params, items: 2})
        expect(data).toEqual(2)
      })

      it('should return expected data if not infinite && index equal slides', () => {
        //   let currInd = currentTranslateXPosition / -itemWidth - items
        const data = Utils.getNextItemIndexBeforeTouchEnd(200, { ...params, items: 1, slides: [1]})
        expect(data).toEqual(0)
      })

      it('should return expected data if not infinite && index less than 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(100, { ...params, items: 2, slides: [1, 2]})
        expect(data).toEqual(1)
      })

      it('should return expected data if not infinite && index more than 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(200, { ...params, slides: [1, 2]})
        expect(data).toEqual(1)
      })

      it('should return expected data if not infinite && index equal 0', () => {
        const data = Utils.getNextItemIndexBeforeTouchEnd(100, { ...params, slides: [1, 2]})
        expect(data).toEqual(0)
      })
    })
  })
})
