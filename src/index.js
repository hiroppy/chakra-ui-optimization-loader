'use strict';

const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');
const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const t = require('@babel/types');

const schema = {
  type: 'object',
  properties: {
    ignoreComponents: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    ignoreColors: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    ignoreBreakpoints: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};

const targetedFiles = [
  'theme/dist/esm/components/index.js',
  'theme/dist/esm/foundations/colors.js',
  'theme/dist/esm/foundations/breakpoints.js',
];

function loader(source) {
  if (!targetedFiles.some((file) => this.resourcePath.includes(file))) {
    return source;
  }

  const options = getOptions(this);

  validate(schema, options, {
    name: 'chakra-ui-optimization-loader',
    options,
  });

  const ast = parse(source, { sourceType: 'module' });

  if (Array.isArray(options.ignoreComponents) && this.resourcePath.includes(targetedFiles[0])) {
    traverse(ast, {
      ExportDefaultDeclaration({ node }) {
        if (t.isObjectExpression(node.declaration)) {
          node.declaration.properties = node.declaration.properties.filter(
            ({ value }) => !options.ignoreComponents.includes(value.name)
          );
        }
      },
    });

    return generate(ast).code;
  }

  if (Array.isArray(options.ignoreColors) && this.resourcePath.includes(targetedFiles[1])) {
    traverse(ast, {
      ObjectExpression({ node }) {
        node.properties = node.properties.filter(
          ({ key }) => !options.ignoreColors.includes(key.name)
        );
      },
    });

    return generate(ast).code;
  }

  if (Array.isArray(options.ignoreBreakpoints) && this.resourcePath.includes(targetedFiles[2])) {
    traverse(ast, {
      ObjectExpression({ node }) {
        node.properties = node.properties.filter(
          ({ key }) => !options.ignoreBreakpoints.includes(key.name)
        );
      },
    });

    return generate(ast).code;
  }

  // TODO: typography

  return source;
}

module.exports = loader;
