/**
 * This file exists to expose and centralize some features that the files in this module expect from the surrounding
 * CLI.
 *
 * The calls will be forwarded to whatever logging system is the "official" logging system for this CLI.
 *
 * Centralizing in this way makes it easy to copy/paste this directory out and have a single place to
 * break dependencies and replace these functions.
 */

export { error } from '../../logging';