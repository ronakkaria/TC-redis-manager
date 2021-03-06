import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RedisInstance} from '../../models/redis-instance';
import {RedisService} from '../../services/redis.service';
import {Store} from '@ngrx/store';
import {REQ_FETCH_TREE, TOGGLE_REDIS} from '../../ngrx/actions/redis-actions';

/**
 * a redis instance tree component
 */
@Component({
  selector: 'app-instance-tree',
  templateUrl: './instance-tree.component.html',
  styleUrls: ['./instance-tree.component.scss']
})
export class InstanceTreeComponent implements OnInit {
  @Input() instance: RedisInstance = null;
  @Output() updatePage = new EventEmitter();
  public selectedMap = {};
  public expandedMap = {};

  constructor(private redisService: RedisService, private _store: Store<any>) {
  }

  /**
   * on redis expand
   */
  onExpand() {
    const id = this.instance.id;
    if (this.instance.expanded) {
      this._store.dispatch({type: TOGGLE_REDIS, payload: {id}});
      return;
    }
    this._store.dispatch({type: REQ_FETCH_TREE, payload: {id}});
    this._store.dispatch({type: TOGGLE_REDIS, payload: {id}});
  }

  /**
   * on redis instance root item click
   */
  onClickRootItem() {
    this.selectedMap = {};
    this.updatePage.emit({
      type: 'root-instance',
      id: this.instance.id,
    });
  }

  /**
   * on item click
   * @param item the data item
   */
  onClickItem(item) {
    this.selectedMap = {};
    this.selectedMap[item.key + item.type] = true;
    this.updatePage.emit({
      type: 'data-viewer',
      id: this.instance.id,
      item: item,
    });
  }

  ngOnInit() {
  }
}
