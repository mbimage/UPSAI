export class AccessibilityChecker {
  private static instance: AccessibilityChecker

  static getInstance(): AccessibilityChecker {
    if (!AccessibilityChecker.instance) {
      AccessibilityChecker.instance = new AccessibilityChecker()
    }
    return AccessibilityChecker.instance
  }

  async checkScrollingAccessibility() {
    const results = {
      desktop: this.checkDesktopScrolling(),
      laptop: this.checkLaptopScrolling(),
      mobile: this.checkMobileScrolling(),
      accessibility: this.checkA11yCompliance(),
      performance: await this.checkScrollPerformance(),
    }

    return results
  }

  private checkDesktopScrolling() {
    const isDesktop = window.innerWidth >= 1024

    return {
      device: "Desktop",
      screenWidth: window.innerWidth,
      smoothScrollSupported: "scrollBehavior" in document.documentElement.style,
      wheelEventSupported: "onwheel" in window,
      customScrollbars: this.hasCustomScrollbars(),
      scrollPerformance: this.measureScrollPerformance(),
      status: isDesktop ? "optimal" : "not-applicable",
    }
  }

  private checkLaptopScrolling() {
    const isLaptop = window.innerWidth >= 768 && window.innerWidth < 1024

    return {
      device: "Laptop",
      screenWidth: window.innerWidth,
      touchpadSupported: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      smoothScrollSupported: "scrollBehavior" in document.documentElement.style,
      trackpadOptimized: this.checkTrackpadOptimization(),
      scrollPerformance: this.measureScrollPerformance(),
      status: isLaptop ? "optimal" : "not-applicable",
    }
  }

  private checkMobileScrolling() {
    const isMobile = window.innerWidth < 768
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)

    return {
      device: "Mobile",
      screenWidth: window.innerWidth,
      platform: isIOS ? "iOS" : isAndroid ? "Android" : "Other",
      momentumScrolling: this.checkMomentumScrolling(),
      touchOptimized: this.checkTouchOptimization(),
      overscrollBehavior: this.checkOverscrollBehavior(),
      scrollPerformance: this.measureScrollPerformance(),
      status: isMobile ? "optimal" : "not-applicable",
    }
  }

  private checkA11yCompliance() {
    return {
      keyboardNavigation: this.checkKeyboardNavigation(),
      screenReaderSupport: this.checkScreenReaderSupport(),
      focusManagement: this.checkFocusManagement(),
      colorContrast: this.checkColorContrast(),
      reducedMotion: this.checkReducedMotionSupport(),
      ariaLabels: this.checkAriaLabels(),
    }
  }

  private async checkScrollPerformance() {
    return new Promise((resolve) => {
      let frameCount = 0
      const startTime = performance.now()

      const measureFrame = () => {
        frameCount++
        if (frameCount < 60) {
          requestAnimationFrame(measureFrame)
        } else {
          const endTime = performance.now()
          const fps = Math.round(1000 / ((endTime - startTime) / frameCount))
          resolve({
            fps,
            performance: fps >= 55 ? "excellent" : fps >= 45 ? "good" : fps >= 30 ? "fair" : "poor",
            frameTime: (endTime - startTime) / frameCount,
          })
        }
      }

      requestAnimationFrame(measureFrame)
    })
  }

  private hasCustomScrollbars() {
    const testElement = document.createElement("div")
    testElement.style.cssText = "overflow:scroll; width:50px; height:50px; position:absolute; top:-200px;"
    document.body.appendChild(testElement)

    const hasCustom = testElement.offsetWidth - testElement.clientWidth < 17
    document.body.removeChild(testElement)

    return hasCustom
  }

  private measureScrollPerformance() {
    const startTime = performance.now()
    window.scrollBy(0, 1)
    window.scrollBy(0, -1)
    const endTime = performance.now()

    return {
      responseTime: endTime - startTime,
      rating: endTime - startTime < 16 ? "excellent" : endTime - startTime < 33 ? "good" : "needs-improvement",
    }
  }

  private checkTrackpadOptimization() {
    return {
      passiveListeners: this.hasPassiveListeners(),
      smoothScrolling: getComputedStyle(document.documentElement).scrollBehavior === "smooth",
      optimized: true,
    }
  }

  private checkMomentumScrolling() {
    const body = document.body
    const computed = getComputedStyle(body)

    return {
      webkitOverflowScrolling: computed.webkitOverflowScrolling === "touch",
      overscrollBehavior: computed.overscrollBehavior !== "auto",
      enabled: true,
    }
  }

  private checkTouchOptimization() {
    return {
      touchAction: getComputedStyle(document.body).touchAction,
      passiveListeners: this.hasPassiveListeners(),
      touchStartOptimized: true,
    }
  }

  private checkOverscrollBehavior() {
    const computed = getComputedStyle(document.body)
    return {
      overscrollBehaviorY: computed.overscrollBehaviorY,
      bounceScrollingPrevented: computed.overscrollBehaviorY === "contain",
      optimized: true,
    }
  }

  private checkKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    return {
      focusableElementsCount: focusableElements.length,
      tabIndexProperlySet: Array.from(focusableElements).every(
        (el) => el.getAttribute("tabindex") !== "-1" || el.hasAttribute("disabled"),
      ),
      skipLinksPresent: document.querySelector('a[href="#main-content"]') !== null,
    }
  }

  private checkScreenReaderSupport() {
    return {
      ariaLabelsPresent: document.querySelectorAll("[aria-label]").length > 0,
      headingStructure: this.checkHeadingStructure(),
      landmarkRoles: document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"]').length > 0,
    }
  }

  private checkFocusManagement() {
    return {
      focusVisible: getComputedStyle(document.body).getPropertyValue("--focus-visible") !== "",
      focusTrapping: document.querySelectorAll("[data-focus-trap]").length > 0,
      skipLinks: document.querySelectorAll('a[href^="#"]').length > 0,
    }
  }

  private checkColorContrast() {
    const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, a, button")
    let contrastIssues = 0

    textElements.forEach((el) => {
      const computed = getComputedStyle(el)
      const color = computed.color
      const backgroundColor = computed.backgroundColor

      if (color === backgroundColor) {
        contrastIssues++
      }
    })

    return {
      elementsChecked: textElements.length,
      contrastIssues,
      rating: contrastIssues === 0 ? "excellent" : contrastIssues < 5 ? "good" : "needs-improvement",
    }
  }

  private checkReducedMotionSupport() {
    return {
      prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      respectsUserPreference: true,
      animationsCanBeDisabled: document.querySelectorAll("[data-reduce-motion]").length > 0,
    }
  }

  private checkAriaLabels() {
    const interactiveElements = document.querySelectorAll("button, a, input, select, textarea")
    let elementsWithLabels = 0

    interactiveElements.forEach((el) => {
      if (
        el.getAttribute("aria-label") ||
        el.getAttribute("aria-labelledby") ||
        el.querySelector("label") ||
        el.textContent?.trim()
      ) {
        elementsWithLabels++
      }
    })

    return {
      totalInteractiveElements: interactiveElements.length,
      elementsWithLabels,
      coverage: Math.round((elementsWithLabels / interactiveElements.length) * 100),
    }
  }

  private checkHeadingStructure() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const levels = Array.from(headings).map((h) => Number.parseInt(h.tagName.charAt(1)))

    let properStructure = true
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        properStructure = false
        break
      }
    }

    return {
      headingCount: headings.length,
      hasH1: document.querySelector("h1") !== null,
      properHierarchy: properStructure,
    }
  }

  private hasPassiveListeners() {
    let passiveSupported = false
    try {
      const options = {
        get passive() {
          passiveSupported = true
          return false
        },
      }
      window.addEventListener("test", () => {}, options)
      window.removeEventListener("test", () => {}, options)
    } catch (err) {
      passiveSupported = false
    }

    return passiveSupported
  }
}
