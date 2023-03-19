/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { Action } from "@eclipse-glsp/protocol";
import "reflect-metadata";

/**
 * This package define action classes used by Open-BPMN.
 *
 * For some reason these actions can't be imported from the corresponding Open-BPMN module.
 * See also file client-actions.ts in the glsp-vscode-integration
 */
export interface BPMNPropertyPanelToggleAction extends Action {
  kind: typeof BPMNPropertyPanelToggleAction.KIND;
}

export namespace BPMNPropertyPanelToggleAction {
  export const KIND = "properties";

  export function is(object: any): object is BPMNPropertyPanelToggleAction {
    return Action.hasKind(object, KIND);
  }

  export function create(): BPMNPropertyPanelToggleAction {
    return { kind: KIND };
  }
}
