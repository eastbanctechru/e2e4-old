﻿define(['jquery'],
    function (jquery)
    {
    	'use strict';
    	jquery.fn.touchControlsFocusLostFix = function (options)
    	{
    		var $parent = jquery(this);
    		jquery(document)
			.on('focus', 'input,textarea,select', function ()
			{
				$parent.addClass(options.addClass);
			})
			.on('blur', 'input,textarea,select', function ()
			{
				$parent.removeClass(options.addClass);
				setTimeout(function ()
				{
					jquery(document).scrollTop(jquery(document).scrollTop());
				}, 1);
			});
    		return this;
    	};
    	jquery.clearSelection = function ()
    	{
    		try
    		{
    			if (window.getSelection)
    			{
    				window.getSelection().removeAllRanges();
    			} else if (document.selection)
    			{
    				document.selection.empty();
    			}
    		} catch (e)
    		{

    		}
    	};
    	
    	jquery.getQueryString = function (path)
    	{
    		path = path || window.location.href;
    		var parts = path.match(/\?([^#]*)?$/);
    		return parts && parts[1] ? parts[1] : '';
    	};
    	jquery.parseQueryString = function (path)
    	{
    		return path ? jquery.deparam(path, true) : {};
    	};
    	jquery.deparam = function (params, coerce)
    	{
    		var obj = {},
				coerceTypes = { 'true': true, 'false': false, 'null': null };

    		// Iterate over all name=value pairs.
    		jquery.each(params.replace(/\+/g, ' ').split('&'), function (j, v)
    		{
    			var param = v.split('='),
					key = decodeURIComponent(param[0]),
					val,
					cur = obj,
					i = 0,

					// If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
					// into its component parts.
					keys = key.split(']['),
					keysLast = keys.length - 1;

    			// If the first keys part contains [ and the last ends with ], then []
    			// are correctly balanced.
    			if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLast]))
    			{
    				// Remove the trailing ] from the last keys part.
    				keys[keysLast] = keys[keysLast].replace(/\]$/, '');

    				// Split first keys part into two parts on the [ and add them back onto
    				// the beginning of the keys array.
    				keys = keys.shift().split('[').concat(keys);

    				keysLast = keys.length - 1;
    			} else
    			{
    				// Basic 'foo' style key.
    				keysLast = 0;
    			}

    			// Are we dealing with a name=value pair, or just a name?
    			if (param.length === 2)
    			{
    				val = decodeURIComponent(param[1]);

    				// Coerce values.
    				if (coerce)
    				{
    					val = val && !isNaN(val) ? +val              // number
							: val === 'undefined' ? undefined         // undefined
							: coerceTypes[val] !== undefined ? coerceTypes[val] // true, false, null
							: val;                                                // string
    				}

    				if (keysLast)
    				{
    					// Complex key, build deep object structure based on a few rules:
    					// * The 'cur' pointer starts at the object top-level.
    					// * [] = array push (n is set to array length), [n] = array if n is 
    					//   numeric, otherwise object.
    					// * If at the last keys part, set the value.
    					// * For each keys part, if the current level is undefined create an
    					//   object or array based on the type of the next keys part.
    					// * Move the 'cur' pointer to the next level.
    					// * Rinse & repeat.
    					for (; i <= keysLast; i++)
    					{
    						key = keys[i] === '' ? cur.length : keys[i];
    						cur = cur[key] = i < keysLast ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
    					}

    				} else
    				{
    					// Simple key, even simpler rules, since only scalars and shallow
    					// arrays are allowed.

    					if (jquery.isArray(obj[key]))
    					{
    						// val is already an array, so push on the next value.
    						obj[key].push(val);

    					} else if (obj[key] !== undefined)
    					{
    						// val isn't an array, but since a second value has been specified,
    						// convert val into an array.
    						obj[key] = [obj[key], val];

    					} else
    					{
    						// val is a scalar.
    						obj[key] = val;
    					}
    				}

    			} else if (key)
    			{
    				// No value was defined, so set something meaningful.
    				obj[key] = coerce ? undefined : '';
    			}
    		});

    		return obj;
    	};
    });