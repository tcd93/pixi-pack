import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, o as onMount, e as element, t as text, a as space, c as claim_element, b as children, f as claim_text, g as detach_dev, h as claim_space, j as attr_dev, k as add_location, l as insert_dev, m as append_dev, n as set_data_dev, p as noop, L as Loading_circle, q as create_component, r as query_selector_all, u as claim_component, w as set_style, x as mount_component, y as transition_out, z as check_outros, A as transition_in, B as destroy_component, C as group_outros } from './client.3223dc4d.js';

/* src/components/ScoreBoard.svelte generated by Svelte v3.32.1 */
const file = "src/components/ScoreBoard.svelte";

function create_fragment(ctx) {
	let div5;
	let header;
	let h1;
	let t0;
	let t1;
	let div4;
	let div1;
	let h20;
	let t2;
	let t3;
	let div0;
	let t4;
	let t5;
	let div3;
	let h21;
	let t6;
	let t7;
	let div2;
	let t8;

	const block = {
		c: function create() {
			div5 = element("div");
			header = element("header");
			h1 = element("h1");
			t0 = text("Scoreboard");
			t1 = space();
			div4 = element("div");
			div1 = element("div");
			h20 = element("h2");
			t2 = text("Player");
			t3 = space();
			div0 = element("div");
			t4 = text(/*playerScore*/ ctx[0]);
			t5 = space();
			div3 = element("div");
			h21 = element("h2");
			t6 = text("Bot");
			t7 = space();
			div2 = element("div");
			t8 = text(/*botScore*/ ctx[1]);
			this.h();
		},
		l: function claim(nodes) {
			div5 = claim_element(nodes, "DIV", {});
			var div5_nodes = children(div5);
			header = claim_element(div5_nodes, "HEADER", { class: true });
			var header_nodes = children(header);
			h1 = claim_element(header_nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t0 = claim_text(h1_nodes, "Scoreboard");
			h1_nodes.forEach(detach_dev);
			header_nodes.forEach(detach_dev);
			t1 = claim_space(div5_nodes);
			div4 = claim_element(div5_nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			div1 = claim_element(div4_nodes, "DIV", {});
			var div1_nodes = children(div1);
			h20 = claim_element(div1_nodes, "H2", {});
			var h20_nodes = children(h20);
			t2 = claim_text(h20_nodes, "Player");
			h20_nodes.forEach(detach_dev);
			t3 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { id: true });
			var div0_nodes = children(div0);
			t4 = claim_text(div0_nodes, /*playerScore*/ ctx[0]);
			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t5 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", {});
			var div3_nodes = children(div3);
			h21 = claim_element(div3_nodes, "H2", {});
			var h21_nodes = children(h21);
			t6 = claim_text(h21_nodes, "Bot");
			h21_nodes.forEach(detach_dev);
			t7 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { id: true, class: true });
			var div2_nodes = children(div2);
			t8 = claim_text(div2_nodes, /*botScore*/ ctx[1]);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			div5_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "text-center");
			add_location(h1, file, 38, 4, 1239);
			attr_dev(header, "class", "svelte-gwuyw6");
			add_location(header, file, 37, 2, 1226);
			add_location(h20, file, 42, 6, 1334);
			attr_dev(div0, "id", "player");
			add_location(div0, file, 43, 6, 1356);
			add_location(div1, file, 41, 4, 1322);
			add_location(h21, file, 46, 6, 1420);
			attr_dev(div2, "id", "bot");
			attr_dev(div2, "class", "svelte-gwuyw6");
			add_location(div2, file, 47, 6, 1439);
			add_location(div3, file, 45, 4, 1408);
			attr_dev(div4, "class", "scoreboard svelte-gwuyw6");
			add_location(div4, file, 40, 2, 1293);
			add_location(div5, file, 36, 0, 1218);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, header);
			append_dev(header, h1);
			append_dev(h1, t0);
			append_dev(div5, t1);
			append_dev(div5, div4);
			append_dev(div4, div1);
			append_dev(div1, h20);
			append_dev(h20, t2);
			append_dev(div1, t3);
			append_dev(div1, div0);
			append_dev(div0, t4);
			append_dev(div4, t5);
			append_dev(div4, div3);
			append_dev(div3, h21);
			append_dev(h21, t6);
			append_dev(div3, t7);
			append_dev(div3, div2);
			append_dev(div2, t8);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*playerScore*/ 1) set_data_dev(t4, /*playerScore*/ ctx[0]);
			if (dirty & /*botScore*/ 2) set_data_dev(t8, /*botScore*/ ctx[1]);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("ScoreBoard", slots, []);

	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	let playerScore = 0;
	let botScore = 0;

	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
		const { bridge } = yield Promise.all([import('./bridge.25ba0a42.js'), ]).then(function(x) { return x[0]; }).then(function (n) { return n.d; });

		bridge.on("game:add-score:player", () => {
			$$invalidate(0, playerScore++, playerScore);
		});

		bridge.on("game:add-score:bot", () => {
			$$invalidate(1, botScore++, botScore);
		});
	}));

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ScoreBoard> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		__awaiter,
		onMount,
		playerScore,
		botScore
	});

	$$self.$inject_state = $$props => {
		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
		if ("playerScore" in $$props) $$invalidate(0, playerScore = $$props.playerScore);
		if ("botScore" in $$props) $$invalidate(1, botScore = $$props.botScore);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [playerScore, botScore];
}

class ScoreBoard extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ScoreBoard",
			options,
			id: create_fragment.name
		});
	}
}

/* src/routes/index.svelte generated by Svelte v3.32.1 */
const file$1 = "src/routes/index.svelte";

// (48:1) {:else}
function create_else_block(ctx) {
	let loadingcircle;
	let current;
	loadingcircle = new Loading_circle({ $$inline: true });

	const block = {
		c: function create() {
			create_component(loadingcircle.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(loadingcircle.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(loadingcircle, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(loadingcircle.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(loadingcircle.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(loadingcircle, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(48:1) {:else}",
		ctx
	});

	return block;
}

// (43:1) {#if successkid}
function create_if_block(ctx) {
	let figure;
	let img;
	let img_src_value;
	let t0;
	let figcaption;
	let t1;

	const block = {
		c: function create() {
			figure = element("figure");
			img = element("img");
			t0 = space();
			figcaption = element("figcaption");
			t1 = text("Have fun!");
			this.h();
		},
		l: function claim(nodes) {
			figure = claim_element(nodes, "FIGURE", { class: true });
			var figure_nodes = children(figure);
			img = claim_element(figure_nodes, "IMG", { alt: true, src: true, class: true });
			t0 = claim_space(figure_nodes);
			figcaption = claim_element(figure_nodes, "FIGCAPTION", {});
			var figcaption_nodes = children(figcaption);
			t1 = claim_text(figcaption_nodes, "Have fun!");
			figcaption_nodes.forEach(detach_dev);
			figure_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(img, "alt", "Success Kid");
			if (img.src !== (img_src_value = /*successkid*/ ctx[0])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "svelte-g2iabk");
			add_location(img, file$1, 44, 3, 1332);
			add_location(figcaption, file$1, 45, 3, 1378);
			attr_dev(figure, "class", "svelte-g2iabk");
			add_location(figure, file$1, 43, 2, 1320);
		},
		m: function mount(target, anchor) {
			insert_dev(target, figure, anchor);
			append_dev(figure, img);
			append_dev(figure, t0);
			append_dev(figure, figcaption);
			append_dev(figcaption, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*successkid*/ 1 && img.src !== (img_src_value = /*successkid*/ ctx[0])) {
				attr_dev(img, "src", img_src_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(figure);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(43:1) {#if successkid}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let t0;
	let div1;
	let scoreboard;
	let t1;
	let div0;
	let t2;
	let current_block_type_index;
	let if_block;
	let current;
	scoreboard = new ScoreBoard({ $$inline: true });
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*successkid*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			t0 = space();
			div1 = element("div");
			create_component(scoreboard.$$.fragment);
			t1 = space();
			div0 = element("div");
			t2 = space();
			if_block.c();
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-1v3feeo\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", {});
			var div1_nodes = children(div1);
			claim_component(scoreboard.$$.fragment, div1_nodes);
			t1 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { style: true });
			children(div0).forEach(detach_dev);
			t2 = claim_space(div1_nodes);
			if_block.l(div1_nodes);
			div1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			document.title = "PIXI with SSR";
			set_style(div0, "height", "25px");
			add_location(div0, file$1, 41, 1, 1272);
			add_location(div1, file$1, 39, 0, 1250);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, div1, anchor);
			mount_component(scoreboard, div1, null);
			append_dev(div1, t1);
			append_dev(div1, div0);
			append_dev(div1, t2);
			if_blocks[current_block_type_index].m(div1, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div1, null);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(scoreboard.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(scoreboard.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div1);
			destroy_component(scoreboard);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Routes", slots, []);

	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	let successkid;

	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
		$$invalidate(0, successkid = (yield Promise.all([import('./successkid.a3a9b98c.js'), ]).then(function(x) { return x[0]; })).default);
	}));

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Routes> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		__awaiter,
		onMount,
		LoadingCircle: Loading_circle,
		ScoreBoard,
		successkid
	});

	$$self.$inject_state = $$props => {
		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
		if ("successkid" in $$props) $$invalidate(0, successkid = $$props.successkid);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [successkid];
}

class Routes extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Routes",
			options,
			id: create_fragment$1.name
		});
	}
}

export default Routes;
