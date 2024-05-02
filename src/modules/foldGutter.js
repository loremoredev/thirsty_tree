import { GutterMarker, ViewPlugin, gutter } from "@codemirror/view";
import {
  codeFolding,
  foldState,
  foldable,
  language,
  syntaxTree,
  foldEffect,
  unfoldEffect,
} from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
// import { getFirstLevelChildren } from "./codemirror.js";

function findFold(state, from, to) {
  let found = null;
  state.field(foldState, false)?.between(from, to, (from, to) => {
    if (!found || found.from > from) found = { from, to };
  });
  return found;
}

let openText = "⌄"; // Default value
let closedText = "›"; // Default value

const foldGutterDefaults = {
  openText,
  closedText,
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => false,
};

class FoldMarker extends GutterMarker {
  constructor(config, open) {
    super();
    this.config = config;
    this.open = open;
  }

  eq(other) {
    return this.config === other.config && this.open === other.open;
  }

  toDOM(view) {
    if (this.config.markerDOM) return this.config.markerDOM(this.open);

    let span = document.createElement("span");
    span.textContent = this.open
      ? this.config.openText
      : this.config.closedText;

    span.title = view.state.phrase(this.open ? "Fold line" : "Unfold line");

    return span;
  }
}

export function foldGutter(config = {}) {
  let fullConfig = Object.assign({}, foldGutterDefaults, config);
  let canFold = new FoldMarker(fullConfig, true),
    canUnfold = new FoldMarker(fullConfig, false);
  let spanwithTestClass;
  let markers = ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.from = view.viewport.from;
        this.markers = this.buildMarkers(view);
      }

      update(update) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.startState.facet(language) !== update.state.facet(language) ||
          update.startState.field(foldState, false) !==
            update.state.field(foldState, false) ||
          syntaxTree(update.startState) !== syntaxTree(update.state) ||
          fullConfig.foldingChanged(update)
        )
          this.markers = this.buildMarkers(update.view);
      }

      buildMarkers(view) {
        let builder = new RangeSetBuilder();
        for (let line of view.viewportLineBlocks) {
          let mark = findFold(view.state, line.from, line.to)
            ? canUnfold
            : foldable(view.state, line.from, line.to)
            ? canFold
            : null;
          if (mark) builder.add(line.from, line.from, mark);
        }
        return builder.finish();
      }
    }
  );

  let { domEventHandlers } = fullConfig;

  return [
    markers,
    gutter({
      class: "cm-foldGutter",
      markers(view) {
        return view.plugin(markers).markers || RangeSet.empty;
      },
      initialSpacer() {
        return new FoldMarker(fullConfig, false);
      },
      domEventHandlers: Object.assign({}, domEventHandlers, {
        click: (view, line, event) => {
          if (
            domEventHandlers.click &&
            domEventHandlers.click(view, line, event)
          ) {
            return true;
          } else {
            console.log("Clicked");
            spanwithTestClass = document.querySelectorAll(".test");
            spanwithTestClass.forEach((span) => {
              span.parentNode.removeChild(span);
            });
            console.log("test", spanwithTestClass);
            const firstLevelChildrenKeys = getFirstLevelChildren(
              JSON.parse(view.state.doc)
            );
            console.log(firstLevelChildrenKeys);
          }
          const countArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
          const spansWithTitleFold = document.querySelectorAll(
            'span[title="Fold line"], span[title="Unfold line"]'
          );
          console.log(spansWithTitleFold);
          spansWithTitleFold.forEach((span, index) => {
            const newSpan = document.createElement("span");
            newSpan.classList.add("test");
            newSpan.textContent = countArray[index] || "error";
            const oldSpan = span.previousElementSibling;
            if (oldSpan && oldSpan.tagName === "SPAN") {
              span.parentNode.removeChild(oldSpan);
            }
            // Insert the new span before the current span
            span.insertAdjacentElement("beforebegin", newSpan);
          });
          let folded = findFold(view.state, line.from, line.to);
          if (folded) {
            view.dispatch({ effects: unfoldEffect.of(folded) });
            return true;
          }
          let range = foldable(view.state, line.from, line.to);
          if (range) {
            view.dispatch({ effects: foldEffect.of(range) });
            return true;
          }
          return false;
        },
      }),
    }),
    codeFolding(),
  ];
}
