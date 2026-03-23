---
pubDatetime: 2025-08-15T12:00:00Z
title: Building a smooth custom bottom sheet with coordinateSpace(.global) in SwiftUI
slug: custom-sheet-with-global-coordinate-space
featured: false
draft: false
tags:
  - SwiftUI
  - iOS
  - gesture
  - animation
description:
  How to implement a custom bottom sheet with a smooth drag gesture.
lang: "en"
translationKey: "custom-sheet-with-global-coordinate-space"
---

For this first article, I'd like to share a recent issue I ran into, caused by a misunderstanding of the `DragGesture(coordinateSpace:)` API in SwiftUI.

## Context

In my app, I needed to implement a bottom sheet with the following constraints:

- Appears without animation as soon as the parent view is displayed.
- No opaque background.
- Two fixed positions: collapsed (default) and expanded.
- Positions computed dynamically.
- The bottom sheet content adapts to the available height.

## First implementation

I created a `DraggableBottomSheet` struct using `DragGesture()` and fixed positions.

<details class="details-block">
<summary>DraggableBottomSheet.swift</summary>

```swift
struct DraggableBottomSheet<Content: View>: View {
    let minHeight: CGFloat
    let maxHeight: CGFloat
    let content: Content

    @State private var height: CGFloat = 0
    @State private var dragStartHeight: CGFloat = 0
    private var backgroundColor: Color = .white

    init(
        minHeight: CGFloat,
        maxHeight: CGFloat,
        @ViewBuilder content: () -> Content
    ) {
        self.minHeight = minHeight
        self.maxHeight = maxHeight
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .center, spacing: 0) {
            dragIndicator()
                .background(backgroundColor)
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            // Store starting height on first drag frame
                            if dragStartHeight == 0 {
                                dragStartHeight = height
                            }

                            // Apply drag with a 50px overshoot allowance
                            let proposedHeight = dragStartHeight - value.translation.height
                            let lowerBound = minHeight - 50
                            let upperBound = maxHeight + 50
                            height = min(
                                max(proposedHeight, lowerBound),
                                upperBound
                            )
                        }
                        .onEnded { _ in
                            // Snap to top or bottom
                            let midpoint = (maxHeight + minHeight) / 2
                            withAnimation(
                                .spring(
                                    response: 0.35,
                                    dampingFraction: 0.8
                                )
                            ) {
                                height = height > midpoint ? maxHeight : minHeight
                            }
                            dragStartHeight = 0
                        }
                )

            let computedHeight = height - dragIndicatorBlocHeight
            if computedHeight > 0 {
                content
                    .frame(height: computedHeight)
            }
        }
        .frame(maxWidth: .infinity)
        .frame(height: height)
        .background(backgroundColor)
        .clipShape(
            UnevenRoundedRectangle(cornerRadii: .init(topLeading: 40, topTrailing: 40))
        )
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: -2)
        .onChange(of: minHeight) { newValue in
            if height == 0 {
                height = newValue
            } else {
                withAnimation {
                    height = newValue
                }
            }
        }
    }

    // MARK: - Drag Indicator

    private let dragIndicatorSize: CGSize = CGSize(width: 64, height: 6)
    private let dragIndicatorTopPadding: CGFloat = 8
    private let dragIndicatorBottomPadding: CGFloat = 10
    private var dragIndicatorBlocHeight: CGFloat {
        dragIndicatorSize.height + dragIndicatorTopPadding + dragIndicatorBottomPadding
    }

    private func dragIndicator() -> some View {
        Color.gray.opacity(0.5)
            .frame(
                width: dragIndicatorSize.width,
                height: dragIndicatorSize.height
            )
            .clipShape(Capsule())
            .padding(.top, dragIndicatorTopPadding)
            .padding(.bottom, dragIndicatorBottomPadding)
            .frame(maxWidth: .infinity, maxHeight: dragIndicatorBlocHeight)
    }
}
```
</details>

<details class="details-block">
<summary>ContentView.swift</summary>

```swift
struct ContentView: View {
    var body: some View {
            ZStack(alignment: .top) {
                topContent()

                VStack {
                    Spacer()
                    DraggableBottomSheet(
                        minHeight: 350,
                        maxHeight: 700
                    ) {
                        sheetContent()
                    }
                }
            }
            .background(Color.gray.opacity(0.1))
            .ignoresSafeArea(.all, edges: .bottom)
    }

    private func topContent() -> some View {
        VStack(spacing: 0) {
            Color.white
                .frame(height: 100)
            Color.blue
                .frame(height: 100)
            Color.red
                .frame(height: 100)
        }
    }

    private func sheetContent() -> some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(0..<100) { index in
                    Text("Item \(index + 1)")
                        .padding()
                        .background(Color.clear)
                }
            }
        }
        .scrollIndicators(.hidden)
    }
}
```
</details>

## The problem: jittering during drag

The bottom sheet was shaking as soon as I dragged it.

<video autoplay loop muted playsinline controls class="video-center">
    <source src="/assets/bottom-sheet-local.webm" type="video/webm">
</video>

## The fix: `coordinateSpace(.global)`

After some digging, I found that using `DragGesture(coordinateSpace: .global)` was enough to solve the issue.

In `DraggableBottomSheet.swift`, replace:

```swift
DragGesture()
```

With:

```swift
DragGesture(coordinateSpace: .global)
```

Result:

<video autoplay loop muted playsinline controls class="video-center">
    <source src="/assets/bottom-sheet-global-fix.webm" type="video/webm">
</video>

## Understanding the difference

### Apple documentation

```swift
public enum CoordinateSpace {

    /// The global coordinate space at the root of the view hierarchy.
    case global

    /// The local coordinate space of the current view.
    case local

    /// A named reference to a view's local coordinate space.
    case named(AnyHashable)
}
```

At first glance, it's a bit abstract.

### Analysis

By adding a print in `.onChanged`:

```swift
.onChanged { value in
    print("Dragging: \(value.location.y)")
    [...]
}
```

With `.local` (default):

```swift
Dragging: 0.0
Dragging: 9.0
Dragging: -0.6666717529296875
Dragging: 7.999994913736998
Dragging: -1.333343505859375
Dragging: 7.666661580403684
Dragging: -2.0000101725260038
Dragging: 7.3333282470703125
Dragging: -2.3333333333333144
Dragging: 6.999989827473996
```

With `.global`:

```swift
Dragging: 506.6666564941406
Dragging: 505.6666564941406
Dragging: 505.0
Dragging: 504.3333282470703
Dragging: 503.3333282470703
Dragging: 502.0
Dragging: 501.3333282470703
Dragging: 499.3333282470703
Dragging: 497.0
Dragging: 495.3333282470703
```

The key difference is:

- `.local`: Coordinates are measured relative to the moving view. The reference point shifts every frame, creating "jumps" in the values.
- `.global`: Coordinates are measured relative to the screen. The reference stays fixed, values are stable.

Easy way to verify: with `.global`, `value.location.y` is relative to the screen, while with `.local`, it's relative to the view itself.

## Bonus: dynamic positions

Computing min/max positions dynamically:

1. Add the `topContentHeight` and `whiteContentHeight` properties.

```swift
@State private var topContentHeight: CGFloat = 0
@State private var whiteContentHeight: CGFloat = 0
```

2. Use `GeometryReader`.

```swift
GeometryReader { geometry in
    ZStack(alignment: .top) {
        topContent()

        VStack {
            Spacer()
            DraggableBottomSheet(
                minHeight: geometry.size.height - topContentHeight,
                maxHeight: geometry.size.height - whiteContentHeight
            ) {
                sheetContent()
            }
        }
    }
    .background(Color.gray.opacity(0.1))
}
.ignoresSafeArea(.all, edges: .bottom)
```

3. Measure the heights of the desired blocks.

```swift
private func topContent() -> some View {
    VStack(spacing: 0) {
        Color.white
            .frame(height: 100)
            .coordinateSpace(name: "whiteContent")
            .readSize(in: "whiteContent") { height in
                whiteContentHeight = height
            }
        Color.blue
            .frame(height: 100)
        Color.red
            .frame(height: 100)
    }
    .coordinateSpace(name: "topContent")
    .readSize(in: "topContent") { height in
        topContentHeight = height
    }
}
```

Final result:

<video autoplay loop muted playsinline controls class="video-center">
    <source src="/assets/bottom-sheet-global.webm" type="video/webm">
</video>

You can access the source code [here](https://github.com/ikaros-nb/DraggableBottomSheet).
