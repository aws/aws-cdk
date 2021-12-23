export class BlueprintBase {
  /**
   * @param id the blueprint id
   */
  constructor(public readonly id: string) { }
}

export class WindowsOSBlueprint extends BlueprintBase {
  /**
   * windows_server_2019
   */
  public static readonly WINDOWS_SERVER_2019 = WindowsOSBlueprint.of('windows_server_2019');
  /**
   * windows_server_2016
   */
  public static readonly WINDOWS_SERVER_2016 = WindowsOSBlueprint.of('windows_server_2016');
  /**
   * windows_server_2012
   */
  public static readonly WINDOWS_SERVER_2012 = WindowsOSBlueprint.of('windows_server_2012');
  /**
   * windows_server_2016_sql_2016_express
   */
  public static readonly WINDOWS_SERVER_2016_SQL_2016_EXPRESS = WindowsOSBlueprint.of('windows_server_2016_sql_2016_express');
  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new WindowsOSBlueprint(id);
  }
}

export class LinuxOSBlueprint extends BlueprintBase {
  /**
   * amazon_linux_2
   */
  public static readonly AMAZON_LINUX_2 = LinuxOSBlueprint.of('amazon_linux_2');
  /**
   * amazon_linux
   */
  public static readonly AMAZON_LINUX = LinuxOSBlueprint.of('amazon_linux');
  /**
   * ubuntu_20_04
   */
  public static readonly UBUNTU_20_04 = LinuxOSBlueprint.of('ubuntu_20_04');
  /**
   * ubuntu_18_04
   */
  public static readonly UBUNTU_18_04 = LinuxOSBlueprint.of('ubuntu_18_04');
  /**
   * ubuntu_16_04_2
   */
  public static readonly UBUNTU_16_04_2 = LinuxOSBlueprint.of('ubuntu_16_04_2');
  /**
   * debian_10
   */
  public static readonly DEBIAN_10 = LinuxOSBlueprint.of('debian_10');
  /**
   * debian_9_13
   */
  public static readonly DEBIAN_9_13 = LinuxOSBlueprint.of('debian_9_13');
  /**
   * debian_8_7
   */
  public static readonly DEBIAN_8_7 = LinuxOSBlueprint.of('debian_8_7');
  /**
   * freebsd_12
   */
  public static readonly FREEBSD_12 = LinuxOSBlueprint.of('freebsd_12');
  /**
   * opensuse_15_2
   */
  public static readonly OPENSUSE_15_2 = LinuxOSBlueprint.of('opensuse_15_2');
  /**
   * centos_8
   */
  public static readonly CENTOS_8 = LinuxOSBlueprint.of('centos_8');
  /**
   * centos_7_2009_01
   */
  public static readonly CENTOS_7_2009_01 = LinuxOSBlueprint.of('centos_7_2009_01');
  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new LinuxOSBlueprint(id);
  }
}

export class LinuxAppBlueprint extends BlueprintBase {

  /**
   * wordpress
   */
  public static readonly WORDPRESS = LinuxAppBlueprint.of('wordpress');
  /**
   * wordpress_multisite
   */
  public static readonly WORDPRESS_MULTISITE = LinuxAppBlueprint.of('wordpress_multisite');
  /**
   * lamp_7
   */
  public static readonly LAMP_7 = LinuxAppBlueprint.of('lamp_7');
  /**
   * nodejs
   */
  public static readonly NODEJS = LinuxAppBlueprint.of('nodejs');
  /**
   * joomla
   */
  public static readonly JOOMLA = LinuxAppBlueprint.of('joomla');
  /**
   * magento
   */
  public static readonly MAGENTO = LinuxAppBlueprint.of('magento');
  /**
   * mean
   */
  public static readonly MEAN = LinuxAppBlueprint.of('mean');
  /**
   * drupal
   */
  public static readonly DRUPAL = LinuxAppBlueprint.of('drupal');
  /**
   * gitlab
   */
  public static readonly GITLAB = LinuxAppBlueprint.of('gitlab');
  /**
   * redmine
   */
  public static readonly REDMINE = LinuxAppBlueprint.of('redmine');
  /**
   * nginx
   */
  public static readonly NGINX = LinuxAppBlueprint.of('nginx');
  /**
   * ghost_bitnami
   */
  public static readonly GHOST_BITNAMI = LinuxAppBlueprint.of('ghost_bitnami');
  /**
   * django_bitnami
   */
  public static readonly DJANGO_BITNAMI = LinuxAppBlueprint.of('django_bitnami');
  /**
   * prestashop_bitnami
   */
  public static readonly PRESTASHOP_BITNAMI = LinuxAppBlueprint.of('prestashop_bitnami');
  /**
   * plesk_ubuntu_18_0_34
   */
  public static readonly PLESK_UBUNTU_18_0_34 = LinuxAppBlueprint.of('plesk_ubuntu_18_0_34');
  /**
   * cpanel_whm_linux
   */
  public static readonly CPANEL_WHM_LINUX = LinuxAppBlueprint.of('cpanel_whm_linux');

  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new LinuxAppBlueprint(id);
  }
}

